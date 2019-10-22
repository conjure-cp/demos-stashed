#!/usr/bin/env python3
import queue
import os
import sys
import signal
import random
import string
import subprocess
import time
import threading
import urllib
import logging
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
import json
USE_HTTPS = False



#global data structures
NUMBER_PROCESSES_LIMIT = 4
REQUEST_ID_RANDOM_STRING_LENGTH = 8
MESSAGE_REQUEST_TIMEOUT = 15
MAX_MESSAGES_SIZE = 5

stages = {"Generating models for":1,
"Savile Row":2,
"Running minion for domain filtering":3,
"Running solver":4
}
stagesToIgnore = {"Generated models:","Saved under:"}

conjurePath = "../conjure"
processes = {}




def findEndOf(text,substr):
    i = text.find(substr)
    return i + len(substr) if i != -1 else i
def removeFileNames(text):
    """this is just a prettyness thing, not a security thing"""
    startIndex = findEndOf(text,".essence:")
    if startIndex != -1:
        return "In specification:" + text[startIndex:]
    startIndex = findEndOf(text,".param:")
    if startIndex != -1:
        return "In parameter:" + text[startIndex:]
    return text


class ProcessRunner(threading.Thread):
    """run a process, launch a new thread which adds output lines to the message queue. 
    Retrieve from message queue with getNextMessage(), class keeps track of the last time getNextMessage() was called.  Note that the process is given a new session so that termination will kill all its child processes."""
    def __init__(self, id, commandArray):
        threading.Thread.__init__(self)
        self.finished = False
        self.requestId = id
        self.process = subprocess.Popen(commandArray,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,start_new_session=True)
        self.processGId = os.getpgid(self.process.pid)
        self.messageQueue = queue.Queue()
        self.timeOfLastRequest = time.time()
        self.start()


    def run(self):
        for line in self.process.stdout:
            message = self._parseMessage(line.decode('utf-8'))
            if not message is None:
                self.messageQueue.put(message)
        self.finished = True
        self.messageQueue.put({"exit":True})
        

    def _parseMessage(self,line):
        if "Error:" in line:
            error = removeFileNames(self.process.stdout.read().decode('utf-8'))
            return {"error":error}
        elif "Copying solution to:" in line:
            self.solutionFilePath = line.replace("Copying solution to: ", "").strip()
            return {"solution":True}
        for stage in stagesToIgnore:
            if stage in line:
                return None
        for (stageString,stageNumber) in stages.items():
            if stageString in line:
                 return {"stage":stageNumber}
        #otherwise
        return {"error":line + self.process.stdout.read().decode('utf-8')}
        #should cover "This should never happen" and other errors


    def getMessages(self,timeout):
        messages = []
        while True:
            self.timeOfLastRequest = time.time()
            try:
                messages.append(self.messageQueue.get(timeout=timeout))
            except queue.Empty:
                break
            if self.messageQueue.empty() or len(messages) > MAX_MESSAGES_SIZE:
                break
        return messages


    def getSolution(self):
        with open(self.solutionFilePath) as f:
            return {"solution":f.read()}

    def terminate(self):
        print("Terminating", self.requestId)
        if self.finished:
            print("already terminated")
            return
        os.killpg(self.processGId, signal.SIGINT)




class ProcessManager(threading.Thread):
    """Tracks the processes dictionary.  If no one has requested the next message of a process in this dictionary for a while, remove it."""
    def __init__(self):
        threading.Thread.__init__(self)
        
    def run(self):
        while True:
            for key in list(processes.keys()):
                try:
                    runner = processes[key]
                    if time.time() - runner.timeOfLastRequest > MESSAGE_REQUEST_TIMEOUT * 2:
                        runner.terminate()
                        del processes[key]
                except KeyError:
                    break
            time.sleep(MESSAGE_REQUEST_TIMEOUT)


def makeNewId():
    randomString = "".join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for _ in range(REQUEST_ID_RANDOM_STRING_LENGTH))
    id = str(time.time()) + "_" + str(threading.get_ident()) + "_" + randomString
    return id


class Handler(SimpleHTTPRequestHandler):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def postDataAsJson(self):
        length = int(self.headers['Content-Length'])
        return json.loads(self.rfile.read(length).decode('utf-8'))


    def stopSolve(self):
        postData = self.postDataAsJson()
        requestId = postData["requestId"]
        processes[requestId].terminate()
        del processes[requestId]
        return {}

    def submitNewProblem(self):
        if len(processes) > NUMBER_PROCESSES_LIMIT:
            return {"error":"Sorry, the server is busy at the moment.  Please wait a minute and try again."}
        postData = self.postDataAsJson()
        currentTime = time.time()
        filePrefix = "../temp_" + str(currentTime) + "_" + str(threading.get_ident())
        essenceFileName = filePrefix + ".essence" 
        paramFileName = filePrefix  + ".param" 
        conjureOutputDirectory = filePrefix + "_conjure-output"
        with open(essenceFileName,"w") as essenceFile:
            print(postData["spec"],file=essenceFile)
        with open(paramFileName,"w") as paramFile:
            print(postData["param"],file=paramFile)
        requestId = makeNewId()
        processes[requestId] = ProcessRunner(id,[conjurePath, "solve",essenceFileName,paramFileName,"-o",conjureOutputDirectory, "--solver-options", "-timelimit 300"])
        return {"requestId":requestId}
    def getSolution(self):
        postData = self.postDataAsJson()
        requestId = postData["requestId"]
        solution = processes[requestId].getSolution()
        try:
            del processes[requestId]
        except KeyError:
            pass
        return solution
    
    def getStatusMessages(self):
        postData = self.postDataAsJson()
        requestId = postData["requestId"]
        if requestId not in processes:
            return [{"exit":True}]
        return processes[requestId].getMessages(MESSAGE_REQUEST_TIMEOUT)
    def do_POST(self):
        if self.path == "/submitNewProblem":
            response = self.submitNewProblem()
        elif self.path == "/stopSolve":
            response = self.stopSolve()
        elif self.path == "/getSolution":
            response = self.getSolution()
        elif self.path == "/getStatusMessages":
            response = self.getStatusMessages()
        else:
            response = {"error":"unrecognised request."}
        jsonString = json.dumps(response)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        print("returning",  jsonString)
        self.wfile.write(bytes(jsonString, "UTF-8"))



class ThreadingSimpleServer(ThreadingMixIn, HTTPServer):
    pass

def run():
    print("Starting process manager")
    processManager = ProcessManager()
    processManager.start()
    print("Running server")
    server = ThreadingSimpleServer(('127.0.0.1', 9000), Handler)
    if USE_HTTPS:
        import ssl
        server.socket = ssl.wrap_socket(server.socket, keyfile='./key.pem', certfile='./cert.pem', server_side=True)
    server.serve_forever()


if __name__ == '__main__':
    if len(sys.argv) == 2:
        conjurePath = sys.argv[1]
    run()

export interface Auto {
  Interactive: any[];
}

export interface StrategyQ {
  Auto: Auto;
}

export interface Auto2 {
  Interactive: any[];
}

export interface StrategyA {
  Auto: Auto2;
}

export interface MInfo {
  finds: any[];
  givens: any[];
  enumGivens: any[];
  enumLettings: any[];
  lettings: any[];
  unnameds: any[];
  strategyQ: StrategyQ;
  strategyA: StrategyA;
  trailCompact: any[];
  trailVerbose: any[];
  trailRewrites: any[];
  nameGenState: any[];
  nbExtraGivens: number;
  representations: any[];
  representationsTree: any[];
  originalDomains: any[];
  questionAnswered: any[];
}

export interface Language {
  Name: string;
}

export interface MLanguage {
  language: Language;
  version: number[];
}

export interface Letting {
  Name: string;
  Constant: Constant;
}

/**
 * The response from the conjure engine
 */
export interface ConjureResponse {
  mInfo: MInfo;
  mLanguage: MLanguage;
  mStatements: Statement[];
}

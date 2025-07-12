export interface JamState {
  currentTheme: string;
  votingEndTime: string;
  jamStartTime: string;
  jamEndTime: string;
  jamPage: string;
  jamStage: string;
  votes: Map<string, number>;
  uservotes: string[];
  themes: string[];
  jamChannel: string;
  jamAdminRole: string
}

export const defaultJamState: JamState = {
  currentTheme: "",
  votingEndTime: "",
  jamStartTime: "",
  jamEndTime: "",
  jamPage: "",
  jamStage: "",
  votes: new Map<string, number>(),
  uservotes: [],
  themes:[],
  jamChannel:"",
  jamAdminRole: "",
};
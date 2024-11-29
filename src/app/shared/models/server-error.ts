export interface TimerData {
  timerValue: number;
  time: number;
}

export interface TimerFunctionReturn {
  status: Promise<{ status: string }>;
  timerValue: number;
}

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

//32

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

//31

export const debug =
  (level: number, message: string) => (source: Observable<any>) =>
    source.pipe(
      tap((val) => {
        if (level >= rxjsLoggingLevel) {
          console.log(message + ": ", val);
        }
      })
    );

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject,
} from "rxjs";
import { delayWhen, filter, map, take, timeout } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    //8
    const interval$ = timer(3000, 1000);

    interval$.subscribe(
      (val) => console.log(val),
      (err) => console.log(err),
      () => console.log("complete")
    );

    //9
    const http$ = Observable.create((observer) => {
      fetch("/api/courses")
        .then((response) => {
          return response.json();
        })
        .then((body) => {
          observer.next(body);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
    http$.subscribe(
      (courses) => console.log(courses),
      (error) => console.log(error),
      () => console.log("complete")
    );

    //10
    const http2$ = createHttpObservable("/api/courses");
    const courses$ = http2$.pipe(map((res) => Object.values(res["payload"])));
    courses$.subscribe(
      (courses) => console.log(courses),
      (error) => console.log(error),
      () => console.log("complete")
    );

    //15
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);
    const result$ = concat(source1$, source2$, source3$);
    result$.subscribe((r) => console.log(r));
    result$.subscribe(console.log);
  }
}

/* function createHttpObservable(url: string) {
  return Observable.create((observer) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
} */

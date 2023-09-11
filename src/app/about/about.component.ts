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

    //18
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map((interval) => interval * 10));
    const result18$ = merge(interval1$, interval2$, interval1$, interval2$);
    result18$.subscribe(console.log);

    //21
    const interval21$ = interval(1000);
    const sub21 = interval21$.subscribe((interval) =>
      console.log("interval21$", interval)
    );
    setTimeout(() => sub21.unsubscribe(), 5000);

    const http21$ = createHttpObservable("/api/courses");
    const sub21_2 = http21$.subscribe((http21) =>
      console.log("http21$", interval)
    );
    setTimeout(() => sub21_2.unsubscribe(), 0);

    //35
    const subject = new Subject();
    const series$ = subject.asObservable();
    series$.subscribe((val) => console.log("early sub: " + val));
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();

    //36
    const subject36 = new BehaviorSubject(0);
    const series36$ = subject36.asObservable();
    series36$.subscribe((val) => console.log("36 - early sub: " + val));
    subject36.next(1);
    subject36.next(2);
    subject36.next(333); //save in memory
    setTimeout(() => {
      series36$.subscribe((val) => console.log("36 - late sub: " + val)); //get 333
      subject36.next(4);
    }, 3000);

    //37
    //const subject37 = new AsyncSubject();
    const subject37 = new ReplaySubject();
    const series37$ = subject37.asObservable();
    series37$.subscribe((val) => console.log("37 - first sub: " + val));
    subject37.next(1);
    subject37.next(2);
    subject37.next(3);
    //subject37.complete();
    setTimeout(() => {
      series37$.subscribe((val) => console.log("37 - second sub: " + val)); //get 333
      subject37.next(4);
    }, 3000);
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

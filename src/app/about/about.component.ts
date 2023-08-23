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
    //1
    const interval$ = timer(3000, 1000);

    interval$.subscribe(
      (val) => console.log(val),
      (err) => console.log(err),
      () => console.log("complete")
    );

    //2
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
  }
}

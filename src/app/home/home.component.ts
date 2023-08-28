import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
  filter,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses12$: Observable<Course[]>;
  advancedCourses12$: Observable<Course[]>;

  beginnerCourses13$: Observable<Course[]>;
  advancedCourses13$: Observable<Course[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    //11
    //если делать filter в subscribe, то это императивный дизайн
    const http11$ = createHttpObservable("/api/courses");
    const courses11$ = http11$.pipe(
      map((res) => Object.values(res["payload"]))
    );
    courses11$.subscribe(
      (courses) => {
        console.log(courses);
        let beginnerCourses = courses.filter((c) => c.category === "BEGINNER");
        let advancedCourses = courses.filter((c) => c.category === "BEGINNER");
        console.log(beginnerCourses, advancedCourses);
      },
      (error) => console.log(error),
      () => console.log("complete")
    );

    //12
    //если делать в стриме с $: Observable, то это реактивный дизайн
    const http12$ = createHttpObservable("/api/courses");
    const courses12$: Observable<Course[]> = http12$.pipe(
      map((res) => Object.values(res["payload"]))
    );
    this.beginnerCourses12$ = courses12$.pipe(
      map((courses) => courses.filter((с) => с.category === "BEGINNER"))
    );
    this.advancedCourses12$ = courses12$.pipe(
      map((courses) => courses.filter((с) => с.category === "ADVANCED"))
    );

    //13
    const http13$ = createHttpObservable("/api/courses");
    const courses13$: Observable<Course[]> = http13$.pipe(
      tap(() => console.log("HTTP Request Executed")),
      map((res) => Object.values(res["payload"])),
      shareReplay()
    );
    this.beginnerCourses13$ = courses13$.pipe(
      map((courses) => courses.filter((с) => с.category === "BEGINNER"))
    );
    this.advancedCourses13$ = courses13$.pipe(
      map((courses) => courses.filter((с) => с.category === "ADVANCED"))
    );

    const courses$ = this.store.courses$;
    //this.beginnerCourses$ = this.store.selectBeginnerCourses();
    //this.advancedCourses$ = this.store.selectAdvancedCourses();
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { Store } from "../common/store.service";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];

    //this.course$ = this.store.selectCourseById(this.courseId);

    //22
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
    //this.lessons$ = createHttpObservable(
    //  `/api/lessons?courseId=${this.courseId}&pageSize=100`
    //).pipe(map((response) => response["payload"]));
  }

  ngAfterViewInit() {
    //23
    const searchLessons$ = fromEvent<any>(
      this.input.nativeElement,
      "keyup"
    ).pipe(
      map((event) => event.target.value),
      startWith(""), //29
      debounceTime(400), //когда прекращаем печатать через 0,4 сек идёт запрос
      //throttle(() => interval(500)), //30 - каждые 0,5 сек пока мы печатаем идём запрос - rate limitter
      //throttleTime(500),
      distinctUntilChanged(),
      //24 - если убрать debounceTime и distinctUntilChanged,
      //то можно увидеть как отменяются запросы
      //concatMap((search) => this.loadLessons(search))
      switchMap((search) => this.loadLessons(search))
    );

    //24
    const initialLessons$ = this.loadLessons();
    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}

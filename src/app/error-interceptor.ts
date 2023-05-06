import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorMessageComponent } from "./error-message/error-message.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  durationInSeconds = 5;

  constructor(private dialog: MatDialog) {}


  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred";
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorMessageComponent, {data: {message: errorMessage}});

        return throwError(error);
      })
    );
  }
}
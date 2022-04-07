import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipe } from './safe.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { hosts } from '../environments/environment';
import { AuthInterceptor } from './interceptors/httpconfig.interceptor';
import { NotFoundComponent } from './notFound/notFound.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CommonDirectiveModule } from './modules/shared/common-directive/common-directive.module';
import { CommonAppModule } from './modules/common/common.module';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { LayoutModule } from "./modules/layout/layout.module";
import { TelerikReportingModule } from '@progress/telerik-angular-report-viewer';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    NotFoundComponent,
    ShortNumberPipe
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutModule,
    TelerikReportingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  providers: [
      { provide: 'API_BASE_URL', useFactory: getBaseUrl },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      HttpClient
  ],
  exports: [
    TranslateModule,
    CommonDirectiveModule,
    CommonAppModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function getBaseUrl(): string {
  return hosts.API_BASE;
}

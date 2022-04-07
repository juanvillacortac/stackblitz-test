import { registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import localeES from '@angular/common/locales/es';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService,
    private titleService: Title
  ) {
    this.translate('es');
    this.titleService.setTitle("ERP");
  }
  translate(lang: string) {
    registerLocaleData(localeES, lang);
    this.translateService.setDefaultLang('es');
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd,  NavigationStart, Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { EnumOfficeSelectorType } from 'src/app/models/common/enum-office-selector-type.enum';
import { CompanyOffice } from 'src/app/models/security/company-office';
import { ModuleP } from 'src/app/models/security/ModuleP';
import { AuthService } from '../../login/shared/auth.service';
import { SecurityService } from '../../security/shared/services/security.service';
import { MenuService } from '../panel-menu/app.menu.service';
import { CurrentOfficeSelectorService } from '../panel-topbar/current-office-selector/shared/current-office-selector.service';
import { LayoutService } from '../shared/layout.service';
import { Access } from "../../../models/security/Access";


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('mask-anim', [
        state('void', style({
            opacity: 0
        })),
        state('visible', style({
            opacity: 0.8
        })),
        transition('* => *', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
]
})
export class LayoutComponent implements OnInit, OnDestroy {
   items: MenuItem[];
   userId: number;
   userOffices: CompanyOffice[] = [];
   currentOffice;
   fullName: '';
   parentModules: ModuleP[] = [];
   menu: MenuItem[];
   horizontalMenu: boolean;
   darkMode = false;
   menuColorMode = 'light';
   menuColor = 'layout-menu-light';
   themeColor = 'blue';
   layoutColor = 'blue';
   rightPanelClick: boolean;
   rightPanelActive: boolean;
   menuClick: boolean;
   staticMenuActive: boolean;
   menuMobileActive: boolean;
   megaMenuClick: boolean;
   megaMenuActive: boolean;
   megaMenuMobileClick: boolean;
   megaMenuMobileActive: boolean;
   topbarItemClick: boolean;
   topbarMobileMenuClick: boolean;
   topbarMobileMenuActive: boolean;
   sidebarActive: boolean;
   activeTopbarItem: any;
   topbarMenuActive: boolean;
   menuHoverActive: boolean;
   configActive: boolean;
   configClick: boolean;
   ripple = true;
   inputStyle = 'outlined';
   routeObserver = null;

  constructor(private _layoutSerice: LayoutService,
    private _securityService: SecurityService,
    private _authService: AuthService,
    private menuService: MenuService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private _officeSelectorService: CurrentOfficeSelectorService) {
      this.fullName = this._authService.entityName;
      this.userId = Number(this._authService.idUser);
      this.staticMenuActive = true;
      this.resetMenuItems();
      this.routeChanged();
    }

    ngOnInit() {
      this.primengConfig.ripple = true;
      this.loadUserOffices();
    }

    ngOnDestroy() {
      this.routeObserver.unsubscribe();
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.rightPanelClick) {
            this.rightPanelActive = false;
        }

        if (!this.megaMenuClick) {
            this.megaMenuActive = false;
        }

        if (!this.megaMenuMobileClick) {
            this.megaMenuMobileActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal()) {
                this.menuService.reset();
            }

            if (this.menuMobileActive) {
                this.menuMobileActive = false;
            }

            this.menuHoverActive = false;
        }

        if (this.configActive && !this.configClick) {
            this.configActive = false;
        }

        this.configClick = false;
        this.menuClick = false;
        this.topbarItemClick = false;
        this.megaMenuClick = false;
        this.megaMenuMobileClick = false;
        this.rightPanelClick = false;
    }

    onMegaMenuButtonClick(event) {
        this.megaMenuClick = true;
        this.megaMenuActive = !this.megaMenuActive;
        event.preventDefault();
    }

    onMegaMenuClick(event) {
        this.megaMenuClick = true;
        event.preventDefault();
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null; } else {
            this.activeTopbarItem = item; }

        event.preventDefault();
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;

        event.preventDefault();
    }

    onRightPanelClose(event) {
        this.rightPanelActive = false;
        this.rightPanelClick = false;

        event.preventDefault();
    }

    onRightPanelClick(event) {
        this.rightPanelClick = true;

        event.preventDefault();
    }

    onTopbarMobileMenuButtonClick(event) {
        this.topbarMobileMenuClick = true;
        this.topbarMobileMenuActive = !this.topbarMobileMenuActive;

        event.preventDefault();
    }

    onMegaMenuMobileButtonClick(event) {
        this.megaMenuMobileClick = true;
        this.megaMenuMobileActive = !this.megaMenuMobileActive;

        event.preventDefault();
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.isMobile()) {
            this.menuMobileActive = !this.menuMobileActive;
        }

        event.preventDefault();
    }

    onSidebarClick(event: Event) {
        this.menuClick = true;
    }

    onToggleMenuClick(event: Event) {
        this.staticMenuActive = !this.staticMenuActive;
        event.preventDefault();
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return window.innerWidth <= 991;
    }

    isHorizontal() {
        return this.horizontalMenu === true;
    }

    onOfficeSelected(companyOffice) {
      this._authService.updateCurrentOffice(companyOffice.idOffice, companyOffice.idCompany,companyOffice.nameCompany,companyOffice.nameOffice);
      this._authService.removeRouteVisited();
      this.getCurrentOffice();
      this.loadUserModules();
    }

    private resetMenuItems(routerLink: string = '/home/dashboard') {
      this.menu = [{
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        routerLink: [routerLink],
      }];
    }

    private loadUserOffices() {
      this._layoutSerice.getCompanyBrachOfficesByUser(this.userId)
        .then(offices => { this.saveDefaultOffice(offices); return offices; })
        .then(offices => this.userOffices = offices)
        .then(() => this.getCurrentOffice())
        .then(() => this.loadUserModules())
        .catch(error => this.handleError(error));
    }

    private loadUserModules() {
      this._securityService.getModulesTreeByUser(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
        .then(modulesTree => this.setupModulesTree(modulesTree))
        .then(_ => this.loadUserAccesses())
        .catch(error => this.handleError(error));
    }

    private loadUserAccesses() {
      this._securityService.getAccessPromise(Number(this.userId), this.currentOffice.idCompany, this.currentOffice.idOffice)
        .then(accesses => {
          this._layoutSerice.sendToStorage(accesses);
        })
        .then(_ => this.silentReload())
        .then(_ => this.checkAccessesToNavigate(this._layoutSerice.access))
        .catch(error => this.handleError(error));
    }

    private silentReload() {
      if (this.checkLastNavigation()) {
        this.navigateToSavedRoute();
      } else {
        this.checkPermissionToNavigate();
      }
    }
    private checkPermissionToNavigate() {
        const currentRoute = this.getRouteAndSegment(this.router.url);
        if (this.checkSegmentPermission(currentRoute.lastSegment)) {
              this.navigate(currentRoute.urlSegments[1], currentRoute.currentRoute);
        } else if (this.checkSegmentPermission(currentRoute.urlSegments[1])) {
              this.navigate(currentRoute.urlSegments[1], '/home');
        } else {
              //this.router.navigateByUrl('/not-found');
        }
    }
    private navigateToSavedRoute() {
        const route = this.getRouteAndSegment(this._authService.lastRouteVisited);
        this.navigate(route.urlSegments[1], route.currentRoute);
    }

    private navigate(urlSegment: string, completeRoute: string) {
        this.router.navigateByUrl(urlSegment, { skipLocationChange: true }).then(() =>
        this.router.navigate([completeRoute]));
    }

    private getRouteAndSegment(route) {
      const currentRoute = route;
      const urlSegments = currentRoute.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];
      return {currentRoute: currentRoute, urlSegments: urlSegments, lastSegment: lastSegment };
    }
    private checkSegmentPermissionsGroup(route) {
      const url = this.getRouteAndSegment(route);
      return url.urlSegments.slice(1, url.urlSegments.length).filter(segment => this.checkSegmentPermission(segment));
    }
    private checkLastNavigation() {
      return this._authService.lastRouteVisited === this.router.url;
    }

    private checkSegmentPermission(segment: string) {
      return this.menu.some(child => this.childrensHasLink(child, segment));
    }

    private childrensHasLink(items: MenuItem, link: string) {
      if (!items.routerLink?.includes(link)) {
        return items.items?.some(child => this.childrensHasLink(child, link));
      }
      return true;
    }

    private setupModulesTree(modulesTree) {
      this.resetMenuItems();
      this.menu = this.menu.concat(modulesTree);
    }

    private getCurrentOffice() {
      this.currentOffice = {
        idOffice: this._authService.currentOffice,
        idCompany: this._authService.currentCompany

      };
    }

    private saveDefaultOffice(companies) {
      if (this._authService.currentOffice !== -1) { return; }
      const firstCompany = companies[0];
      const firstOffice = firstCompany?.offices[0];
      this.onOfficeSelected({ idOffice: firstOffice?.id ?? -1, idCompany: firstCompany?.id ?? -1,nameCompany: firstCompany?.name ?? '',nameOffice: firstOffice?.name ?? '' });
    }

    private handleError(error) {
      console.error('Error at layout-componet', error);
    }

    private routeChanged() {
      this.routeObserver = this.router.events.subscribe((event) => {
          if (event instanceof NavigationStart) {
              this.resetSelector();
          }
          if (event instanceof NavigationEnd) {
            if (this.navigatingByUrl(event.id, event.url)) {
              if (this.checkSegmentPermissionsGroup(event.url).length < 2) {
                  //this.router.navigateByUrl('/not-found');
              }
            }
              this._authService.updateRouteVisited(event.url);
          }
      });
    }
    private navigatingByUrl(id, url) {
      return id === 1 && this._authService.lastRouteVisited !== url;
    }
    private resetSelector() {
      this._officeSelectorService.setSelectorType(EnumOfficeSelectorType.office);
    }

    private checkAccessesToNavigate(accesses: Access[]){
      if (!accesses.length) {
        this.router.navigate(['/profile/me']);
        this.resetMenuItems('');
      } else if (!this._authService.lastRouteVisited) {
        this.router.navigate(['/home/dashboard']);
      }
    }
}

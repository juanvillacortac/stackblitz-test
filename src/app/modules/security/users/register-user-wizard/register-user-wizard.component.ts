import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './register-user-wizard.component.html',
    styleUrls: ['register-user-wizard.component.scss'],
    providers: [MessageService]
})
export class RegisterUsersWizardComponent implements OnInit, OnDestroy {

    items: MenuItem[];

    subscription: Subscription;
    activeIndex = 0;
    constructor(public messageService: MessageService) {}


    ngOnInit() {
        this.items = [{
            label: 'Registro',
            routerLink: '/security/register-wizard/registro'
        },
        {
            label: 'Roles',
            routerLink: '/security/register-wizard/roles'
        }
    ];
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}

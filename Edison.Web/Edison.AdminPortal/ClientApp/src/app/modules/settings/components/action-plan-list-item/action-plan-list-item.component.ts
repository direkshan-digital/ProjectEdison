import { Subscription } from 'rxjs';

import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ActionPlan } from '../../../../reducers/action-plan/action-plan.model';

@Component({
    selector: 'app-action-plan-list-item',
    templateUrl: './action-plan-list-item.component.html',
    styleUrls: [ './action-plan-list-item.component.scss' ]
})
export class ActionPlanListItemComponent implements OnInit, OnDestroy, OnChanges {
    @Input() actionPlan: ActionPlan;

    @Output() actionPlanChanged = new EventEmitter<ActionPlan>();
    @Output() getActionPlanDetails = new EventEmitter<string>();

    itemForm: FormGroup;
    itemFormSub$: Subscription;
    activationMessage: string;
    deactivationMessage: string;

    constructor () { }

    ngOnInit() {
        if (!this.actionPlan.openActions) {
            this.getActionPlanDetails.emit(this.actionPlan.actionPlanId);
        }

        this.activationMessage = this.actionPlan.openActions ? this.actionPlan.openActions[ 0 ].parameters.message : '';
        this.deactivationMessage = this.actionPlan.closeActions ? this.actionPlan.closeActions[ 0 ].parameters.message : '';

        this.itemForm = new FormGroup({
            'activationMessage': new FormControl(this.activationMessage, [
                Validators.required,
            ]),
            'deactivationMessage': new FormControl(this.deactivationMessage, [
                Validators.required,
            ]),
            'primaryRadius': new FormControl(this.actionPlan.primaryRadius, [
                Validators.required
            ]),
            'secondaryRadius': new FormControl(this.actionPlan.secondaryRadius, [
                Validators.required
            ])
        })

        this.itemFormSub$ = this.itemForm.valueChanges.subscribe(() => this.valueChanges());
    }

    ngOnDestroy() {
        this.itemFormSub$.unsubscribe();
    }

    ngOnChanges() {
        this._disableFormIfLoading();
    }

    private _disableFormIfLoading() {
        if (!this.itemForm) { return; }

        if (this.actionPlan.loading) {
            this.itemForm.disable();
        } else {
            this.itemForm.enable();
        }
    }

    valueChanges() {
        if (this.itemForm.dirty) {
            if (this.actionPlan.openActions && this.actionPlan.openActions[ 0 ]) {
                this.actionPlan.openActions[ 0 ].parameters.message = this.itemForm.get('activationMessage').value;
            }

            if (this.actionPlan.closeActions && this.actionPlan.closeActions[ 0 ]) {
                this.actionPlan.closeActions[ 0 ].parameters.message = this.itemForm.get('deactivationMessage').value;
            }

            this.actionPlan.primaryRadius = this.itemForm.get('primaryRadius').value;
            this.actionPlan.secondaryRadius = this.itemForm.get('secondaryRadius').value;

            this.actionPlanChanged.emit(this.actionPlan);
        }
    }

}

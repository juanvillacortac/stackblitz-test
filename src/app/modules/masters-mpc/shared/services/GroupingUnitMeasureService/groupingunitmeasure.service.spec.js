"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var groupingunitmeasure_service_1 = require("./groupingunitmeasure.service");
describe('GroupingunitmeasureService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(groupingunitmeasure_service_1.GroupingunitmeasureService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=groupingunitmeasure.service.spec.js.map
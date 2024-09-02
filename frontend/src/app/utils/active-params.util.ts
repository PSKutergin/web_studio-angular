import { Params } from "@angular/router";
import { ActiveParamsType } from "src/app/types/active-params.type";

export class ActiveParamsUtil {
    static processParams(params: Params): ActiveParamsType {
        const activeParams: ActiveParamsType = { categories: [], page: 1 };

        if (params.hasOwnProperty('categories')) activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
        if (params.hasOwnProperty('page')) activeParams.page = +params['page'];

        return activeParams;
    }
}
import { ApiClient, ApiResponse } from "@/src/core/network";
import { CheckOwnerExistsRequest, CheckOwnerExistsResponse } from "../types/owner-registration-types";
import { ApiEndpoints } from "@/src/core/constants/api-endpoints";

export class OwnerRegistrationApi {
    constructor(private readonly client: ApiClient) { }

    checkOwnerExists(req: CheckOwnerExistsRequest): Promise<ApiResponse<CheckOwnerExistsResponse>> {
        return this.client.post(ApiEndpoints.owner.checkClinicOwnerExists, req);
    }
}
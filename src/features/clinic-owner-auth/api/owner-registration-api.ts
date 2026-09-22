import { ApiClient, ApiResponse } from "@/src/core/network";
import { CheckOwnerExistsRequest, CheckOwnerExistsResponse, OwnerLoginRequest, OwnerLoginResponse, OwnerRegisterRequest, OwnerRegistrationResponse } from "../types/owner-registration-types";
import { ApiEndpoints } from "@/src/core/constants/api-endpoints";

export class OwnerRegistrationApi {
    constructor(private readonly client: ApiClient) { }

    checkOwnerExists(req: CheckOwnerExistsRequest): Promise<ApiResponse<CheckOwnerExistsResponse>> {
        return this.client.post(ApiEndpoints.owner.checkClinicOwnerExists, req);
    }

    register(req: OwnerRegisterRequest): Promise<ApiResponse<OwnerRegistrationResponse>> {
        return this.client.post(ApiEndpoints.owner.registerClinicOwner, req)
    }

    login(req: OwnerLoginRequest): Promise<ApiResponse<OwnerLoginResponse>> {
        return this.client.post(ApiEndpoints.owner.login, req);
    }
}
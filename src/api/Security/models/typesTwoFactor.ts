import {IFormTwoFactorDTO} from "@/store/SecurityStore";

export interface IPutSecurityTwoFactorBody {
  user_id: string
  two_factor: number
}

export interface IPutSecurityTwoFactorResponse {
  message : string
}
export interface ITwoFactorClient {
  putSecurityTwoFactor: (putSecurityTwoFactorBody: IFormTwoFactorDTO) => Promise<IPutSecurityTwoFactorResponse>
}

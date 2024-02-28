import { BaseItem } from ".";

export interface Ball extends BaseItem<{}>, CreateBallReq {}

export interface CreateBallReq {
  name: string;
  detail: string;
}

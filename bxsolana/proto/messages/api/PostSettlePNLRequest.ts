import {
  Type as PerpContract,
  name2num,
  num2name,
} from "../common/PerpContract";
import {
  Type as Project,
  name2num as name2num_1,
  num2name as num2name_1,
} from "./Project";
import {
  tsValueToJsonValueFns,
  jsonValueToTsValueFns,
} from "../../runtime/json/scalar";
import {
  WireMessage,
  WireType,
} from "../../runtime/wire/index";
import {
  default as serialize,
} from "../../runtime/wire/serialize";
import {
  tsValueToWireValueFns,
  wireValueToTsValueFns,
} from "../../runtime/wire/scalar";
import {
  default as Long,
} from "../../runtime/Long";
import {
  default as deserialize,
} from "../../runtime/wire/deserialize";

export declare namespace $.api {
  export interface PostSettlePNLRequest {
    ownerAddress: string;
    settleeAccountAddress: string;
    contract: PerpContract;
    project: Project;
  }
}
export type Type = $.api.PostSettlePNLRequest;

export function getDefaultValue(): $.api.PostSettlePNLRequest {
  return {
    ownerAddress: "",
    settleeAccountAddress: "",
    contract: "ALL",
    project: "P_UNKNOWN",
  };
}

export function createValue(partialValue: Partial<$.api.PostSettlePNLRequest>): $.api.PostSettlePNLRequest {
  return {
    ...getDefaultValue(),
    ...partialValue,
  };
}

export function encodeJson(value: $.api.PostSettlePNLRequest): unknown {
  const result: any = {};
  if (value.ownerAddress !== undefined) result.ownerAddress = tsValueToJsonValueFns.string(value.ownerAddress);
  if (value.settleeAccountAddress !== undefined) result.settleeAccountAddress = tsValueToJsonValueFns.string(value.settleeAccountAddress);
  if (value.contract !== undefined) result.contract = tsValueToJsonValueFns.enum(value.contract);
  if (value.project !== undefined) result.project = tsValueToJsonValueFns.enum(value.project);
  return result;
}

export function decodeJson(value: any): $.api.PostSettlePNLRequest {
  const result = getDefaultValue();
  if (value.ownerAddress !== undefined) result.ownerAddress = jsonValueToTsValueFns.string(value.ownerAddress);
  if (value.settleeAccountAddress !== undefined) result.settleeAccountAddress = jsonValueToTsValueFns.string(value.settleeAccountAddress);
  if (value.contract !== undefined) result.contract = jsonValueToTsValueFns.enum(value.contract) as PerpContract;
  if (value.project !== undefined) result.project = jsonValueToTsValueFns.enum(value.project) as Project;
  return result;
}

export function encodeBinary(value: $.api.PostSettlePNLRequest): Uint8Array {
  const result: WireMessage = [];
  if (value.ownerAddress !== undefined) {
    const tsValue = value.ownerAddress;
    result.push(
      [1, tsValueToWireValueFns.string(tsValue)],
    );
  }
  if (value.settleeAccountAddress !== undefined) {
    const tsValue = value.settleeAccountAddress;
    result.push(
      [2, tsValueToWireValueFns.string(tsValue)],
    );
  }
  if (value.contract !== undefined) {
    const tsValue = value.contract;
    result.push(
      [3, { type: WireType.Varint as const, value: new Long(name2num[tsValue as keyof typeof name2num]) }],
    );
  }
  if (value.project !== undefined) {
    const tsValue = value.project;
    result.push(
      [4, { type: WireType.Varint as const, value: new Long(name2num_1[tsValue as keyof typeof name2num_1]) }],
    );
  }
  return serialize(result);
}

export function decodeBinary(binary: Uint8Array): $.api.PostSettlePNLRequest {
  const result = getDefaultValue();
  const wireMessage = deserialize(binary);
  const wireFields = new Map(wireMessage);
  field: {
    const wireValue = wireFields.get(1);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.string(wireValue);
    if (value === undefined) break field;
    result.ownerAddress = value;
  }
  field: {
    const wireValue = wireFields.get(2);
    if (wireValue === undefined) break field;
    const value = wireValueToTsValueFns.string(wireValue);
    if (value === undefined) break field;
    result.settleeAccountAddress = value;
  }
  field: {
    const wireValue = wireFields.get(3);
    if (wireValue === undefined) break field;
    const value = wireValue.type === WireType.Varint ? num2name[wireValue.value[0] as keyof typeof num2name] : undefined;
    if (value === undefined) break field;
    result.contract = value;
  }
  field: {
    const wireValue = wireFields.get(4);
    if (wireValue === undefined) break field;
    const value = wireValue.type === WireType.Varint ? num2name_1[wireValue.value[0] as keyof typeof num2name_1] : undefined;
    if (value === undefined) break field;
    result.project = value;
  }
  return result;
}

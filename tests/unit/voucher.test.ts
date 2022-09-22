import { jest } from "@jest/globals";

import voucherService, {
  VoucherCreateData,
} from "../../src/services/voucherService";

import voucherRepository from "../../src/repositories/voucherRepository";
import { rejects } from "assert";

jest.mock("./../../src/repositories/voucherRepository");

describe("voucherService test suite", () => {
  it("should create voucher", async () => {
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {});
    jest
      .spyOn(voucherRepository, "createVoucher")
      .mockImplementationOnce((): any => {});

    await voucherService.createVoucher("aaa", 10);
    expect(voucherRepository.getVoucherByCode).toBeCalled();
  });
  it("should test duplicate voucher", async () => {
    const voucher: VoucherCreateData = {
      code: "AAA",
      discount: 10
    };

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        code: voucher.code,
        discount: voucher.discount
      }
    });

    const promise = voucherService.createVoucher(voucher.code, voucher.discount);
    expect(promise).rejects.toEqual({ message: "Voucher already exist.", type: "conflict" });
  });
});

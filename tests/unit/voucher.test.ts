import { jest } from "@jest/globals";

import voucherService, {
  VoucherCreateData,
} from "../../src/services/voucherService";

import voucherRepository from "../../src/repositories/voucherRepository";

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

  it*
});

import { jest } from "@jest/globals";
import voucherService, {
  VoucherCreateData,
} from "../../src/services/voucherService";
import voucherRepository from "../../src/repositories/voucherRepository";

jest.mock("./../../src/repositories/voucherRepository");

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

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
    expect(voucherRepository.createVoucher).toBeCalled();
  });
  it("should test duplicate voucher", async () => {
    const voucher: VoucherCreateData = {
      code: "AAA",
      discount: 10,
      used: true,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          code: voucher.code,
          discount: voucher.discount,
        };
      });

    const promise = voucherService.createVoucher(
      voucher.code,
      voucher.discount
    );
    expect(promise).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict",
    });
  });
  it("should test apply voucher discount", async () => {
    const voucher: VoucherCreateData = {
      code: "AAA",
      discount: 10,
      used: false,
    };
    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: voucher.used,
        };
      });
    jest
      .spyOn(voucherRepository, "useVoucher")
      .mockImplementationOnce((): any => {});

    const amount = 2000;
    const result = await voucherService.applyVoucher(voucher.code, amount);
    expect(result.amount).toBe(amount);
    expect(result.discount).toBe(voucher.discount);
    expect(result.finalAmount).toBe(amount - amount * (voucher.discount / 100));
  });
  it("should test apply voucher discount not exists", async () => {
    const voucher: VoucherCreateData = {
      code: "BBB",
      discount: 15,
      used: false,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    const amount: number = 1000;
    const response = voucherService.applyVoucher(voucher.code, amount);

    expect(response).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict",
    });
  });
  it("should test apply voucher discount not valid", async () => {
    const voucher: VoucherCreateData = {
      code: "CCC",
      discount: 20,
      used: true,
    };

    jest
      .spyOn(voucherRepository, "getVoucherByCode")
      .mockImplementationOnce((): any => {
        return {
          id: 1,
          code: voucher.code,
          discount: voucher.discount,
          used: voucher.used,
        };
      });

    const amount: number = 1000;
    const response = await voucherService.applyVoucher(voucher.code, amount);
    expect(response.amount).toBe(amount);
    expect(response.applied).toBe(false);
    expect(response.discount).toBe(voucher.discount);
    expect(response.finalAmount).toBe(response.finalAmount);
  });
});

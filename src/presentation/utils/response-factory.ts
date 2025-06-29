import { BaseResponse, PaginationMeta } from "../../domain/types/";
import { ApiError } from "../../domain/errors/";

export class ResponseFactory {
  static success<T>(data: T, message: string): BaseResponse<T> {
    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static error(apiError: ApiError): BaseResponse<null> {
    return {
      success: false,
      data: null,
      message: apiError.message,
      error: apiError,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
  ): BaseResponse<T[]> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        pagination,
      },
    };
  }
}

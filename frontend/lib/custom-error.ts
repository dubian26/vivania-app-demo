import { type ErrorModel } from "@/models/error-model"

export class CustomError extends Error {
  errorModel: ErrorModel

  constructor(message: string) {
    super(message)
    this.name = "CustomError"
    this.errorModel = {
      type: "Custom",
      code: "ExBundle",
      message: message,
      traceId: "",
      details: [],
    }
  }

  static fromModel(error: ErrorModel): CustomError {
    const customError = new CustomError(error.message)
    customError.errorModel = error
    return customError
  }

  static fromFetch(name: string): CustomError {
    return new CustomError(`Error consultando el recurso ${name}`)
  }

  static fromConnection(): CustomError {
    return new CustomError(
      "No se pudo establecer conexión con el servidor. Intenta de nuevo."
    )
  }
}

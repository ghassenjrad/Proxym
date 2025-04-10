import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/user/user.entity";


/**
 * Custom decorator to retrieve the user object from the request. (from the token we sent as a header)
 * @param _data - The data passed to the decorator (not used in this implementation).
 * @param ctx - The execution context containing the request object.
 * @returns The user object from the request.
 */
export const GetUser = createParamDecorator(
    (_data, ctx: ExecutionContext): User => {
      const req = ctx.switchToHttp().getRequest();
    return req.user;
    },
  );
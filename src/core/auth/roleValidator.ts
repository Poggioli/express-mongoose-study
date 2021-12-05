import { User, Role, RoleModel } from '@models'
import { ForbiddenError } from '@src/core/customErrors'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

export default function roleValidator(...roles: string[]): (req: Request, resp: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, resp: Response, next: NextFunction): Promise<void> => {
    const { user } = (req as any)
    const userRoles = ((user as User).roles as Role[])
      .map((r: Role) => ({ code: r.code, access: r.access }))

    const findRoles: Role[] = []
    // eslint-disable-next-line no-restricted-syntax
    for (const role of roles) {
      // eslint-disable-next-line no-await-in-loop
      await RoleModel.findOne({ code: role }).then((r: Role | null) => findRoles.push(r as Role)).then()
    }
    const rolesNeeded = findRoles
      .map((r: Role) => ({ code: r.code, access: r.access }))

    const hasAccess = rolesNeeded.some((rn) => userRoles.some((ur) => ur.code === rn.code))
    const hasRoleGrather = rolesNeeded.some((rn) => userRoles.some((ur) => ur.access >= rn.access))

    if (hasAccess || hasRoleGrather) {
      next()
      return
    }
    resp.status(StatusCodes.FORBIDDEN).json(new ForbiddenError().message)
  }
}

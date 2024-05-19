import { Injectable } from "@angular/core";
import { Role } from "../models/role";


@Injectable({
    providedIn: 'root'
})

export class RoleService{
    private readonly ROLES_KEY = 'user_role';

    constructor() { }
  
    // Lưu trữ mảng các quyền của người dùng vào localStorage
    saveRole(role: Role): void {
      localStorage.setItem(this.ROLES_KEY, JSON.stringify(role));
    }
  
    // Lấy mảng các quyền của người dùng từ localStorage
    getRole(): Role | null {
      const rolesString = localStorage.getItem(this.ROLES_KEY);
      return rolesString ? JSON.parse(rolesString) : null;
    }
  
    // Xóa mảng các quyền của người dùng khỏi localStorage
    clearRole(): void {
      localStorage.removeItem(this.ROLES_KEY);
    }

}
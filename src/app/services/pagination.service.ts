import { Injectable } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class PaginationService {
   constructor() {}

   paginateData(data: any[], pageSize: number): any[][] {
      const paginatedData: any[][] = [];
      for (let i = 0; i < data.length; i += pageSize) {
         paginatedData.push(data.slice(i, i + pageSize));
      }
      return paginatedData;
   }

   getTotalPages(data: any[], pageSize: number): number {
      return Math.ceil(data.length / pageSize);
   }

   getPageRange(totalPages: number): number[] {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
   }
}

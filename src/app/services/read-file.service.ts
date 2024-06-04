import { Injectable } from '@angular/core';
import { Observable, Observer, Subscriber } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReadFileService {
   // Hàm đọc file với chunking
   readFileWithChunking(file: File, chunkSize: number): Observable<string[]> {
      return new Observable<string[]>((observer: Subscriber<string[]>) => {
         const fileSize = file.size;
         const numberOfChunks = Math.ceil(fileSize / chunkSize);
         const fileReader = new FileReader();

         let currentChunk = 0;

         fileReader.onload = () => {
            const chunkContent: string = fileReader.result as string;
            observer.next([chunkContent]); // Gửi chunk về cho subscriber

            currentChunk++;

            if (currentChunk < numberOfChunks) {
               const start = currentChunk * chunkSize;
               const end = Math.min(start + chunkSize, fileSize);
               const chunk = file.slice(start, end);
               fileReader.readAsText(chunk); // Đọc chunk tiếp theo
            } else {
               observer.complete(); // Kết thúc khi đã đọc hết file
            }
         };

         const initialChunk = file.slice(0, chunkSize);
         fileReader.readAsText(initialChunk); // Đọc chunk đầu tiên
      });
   }

   readFile(file: File): Observable<string[]> {
      const CHUNK_SIZE = 1024 * 1024;
      let offset = 0;
      const chunks: string[] = [];

      return new Observable((observer: Observer<string[]>) => {
         const reader = new FileReader();
         reader.onload = () => {
            const chunk = reader.result as string;
            chunks.push(chunk);

            if (offset < file.size) {
               readNextChunk();
            } else {
               observer.next(chunks);
               observer.complete();
            }
         };

         reader.onerror = (error) => {
            observer.error(error);
         };

         function readNextChunk(): void {
            const blob = file.slice(offset, offset + CHUNK_SIZE);
            reader.readAsText(blob);
            offset += CHUNK_SIZE;
         }

         readNextChunk();

         return () => {
            reader.abort();
         };
      });
   }
}

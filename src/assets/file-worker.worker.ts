/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  console.log('Data received in Worker:', data);
  const { file, dataset } = data;
  const text = await file.text();
  const lines = text
    .split('\n')
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0);

  const processedLines = lines.map((line: string, index: number) => {
    const errors = findErrors(line, dataset);
    return errors.length ? `error ${line}` : line;
  });

  postMessage({
    originalContent: extractValues(lines, dataset),
    errorReport: processedLines.join('\n'),
  });

  function findErrors(line: string, dataset: any): string[] {
    // Your findErrors logic
    const errors: string[] = []; 
  
    if (dataset.isRangeInput) {
      // Kiểm tra định dạng "from: giá trị-to:giá trị"
      const match = line.match(/from:\s*(\w+)\s*-to:\s*(\w+)/);
      if (!match) {
        errors.push('Invalid format (from:value-to:value)');
      } else {
        const from = match[1];
        const to = match[2];
  
        if (
          isErrorDatasetValue(from, dataset.fields) ||
          isErrorDatasetValue(to, dataset.fields)
        ) {
          errors.push('Wrong format');
        }
      }
    } else {
      // Kiểm tra định dạng "value:giá trị"
      const match = line.match(/value:\s*(\w+)/);
      if (!match) {
        errors.push('Invalid format (value:giá trị)');
      } else {
        const value = match[1];
        if (isErrorDatasetValue(value, dataset.fields)) {
          errors.push('Wrong format');
        }
      }
    }
  
    return errors;
  }
  
  function extractValues(lines: string[], dataset: any): any[] {
   
    // Your extractValues logic
    const values: any[] = [];
    lines.forEach((line) => {
      if (dataset.isRangeInput) {
        const match = line.match(/from:\s*(\S+)\s*-to:\s*(\S+)/);
        if (match && match[1] && match[2]) {
          values.push({ from: match[1], to: match[2], value: null });
        } else {
          values.push(null);
        }
      } else {
        const valueMatch = line.match(/value:\s*(\S+)\s*/);
        if (valueMatch && valueMatch[1]) {
          values.push({ value: valueMatch[1], from: null, to: null });
        } else {
          values.push(null);
        }
      }
    });
    return values;
  }
  
  function isErrorDatasetValue(input: string, fields: string[]): boolean {
    const REGEX = /^((?!_).)*$/;
    if (fields[0] === 'CELL') {
      // console.log(this.checkValueDatasetIfFieldIsCell(input, fields))
      return checkValueDatasetIfFieldIsCell(input, fields);
    } else if (fields.length > 1) {
      // console.log(this.checkValueDataset(input, fields))
      return checkValueDataset(input, fields);
    } else if (fields.length === 1) {
      // console.log(fields)
      // console.log(this.REGEX.test(input))
      return !REGEX.test(input);
    }
    return false;
  }
  
  function checkValueDatasetIfFieldIsCell(
    input: string,
    fields: string[]
  ): boolean {
    const REGEX = /^((?!_).)*$/;
    let arr;
    if (!input.startsWith('_')) return true;
    arr = input.split('_');
    arr = arr.filter((item, index) => index !== 0);
    if (arr.filter((v) => v === '').length !== 0) return true;
    if (arr.length !== fields.length) return true;
    return arr.filter((item) => !REGEX.test(item)).length !== 0;
  }
  
  function checkValueDataset(input: string, fields: string[]): boolean {
    const REGEX = /^((?!_).)*$/;
    let arr;
    if (!input.includes('_')) return true;
    arr = input.split('_');
    if (arr.filter((item) => item === '').length !== 0) return true;
    if (arr.length !== fields.length) return true;
    return arr.filter((item) => !REGEX.test(item)).length !== 0;
  }
});



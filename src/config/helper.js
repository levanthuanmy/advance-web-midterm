import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

export const simpleEncode = (str = '') => {
  var arr1 = []
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return arr1.join('')
}

export const simpleDecode = (str1 = '') => {
  var hex = str1.toString()
  var str = ''
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
  }
  return str
}


export const downloadTemplate = (data, fileName) => {
  let book = XLSX.utils.book_new()

  book.Props = {
    Title: "Template",
    Subject: "Template",
    Author: "MyClassroom",
    CreatedDate: new Date(),
  }

  book.SheetNames.push(fileName)
  book.Sheets[fileName] = XLSX.utils.aoa_to_sheet(data)

  const output = XLSX.write(book, { bookType: "xlsx", type: "array" })

  saveAs(
    new Blob([output], { type: "application/octet-stream" }),
    `${fileName}.xlsx`
  )
}
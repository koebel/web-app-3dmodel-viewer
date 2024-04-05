import axios from 'axios'
import { xml2js } from 'xml-js'
import { _ } from 'lodash'
import config from '../config'
import _path from 'path'
import * as fs from "fs";

const sendRequest = ({ method, path, data=null }): Promise<any> => {
  const headers = {
    Authorization: `Basic ${Buffer.from(`${config.adminUser}:${config.adminPassword}`).toString('base64')}`
  }
  return axios({
    method,
    url: _path.join(config.baseUrlOcis, path),
    headers,
    data
  })
}

export const deleteFile = async (filename): Promise<void> => {
  return await sendRequest({ method: 'DELETE', path: _path.join('remote.php/dav/files/admin', filename) })
}
export const uploadFile = async (filename: string): Promise<void> => {
  // TODO make dynamic the path
  const fileUploadUrl = _path.join('remote.php/dav/files/admin', filename)
  const filePath = _path.join(config.assets, filename)
  const fileContent = fs.readFileSync(filePath)
  await sendRequest(
    {
      method: 'PUT',
      path: fileUploadUrl,
      data: fileContent
    })
}

export const emptyTrashbin = async (): Promise<void> => {
  return await sendRequest({ method: 'DELETE', path: 'remote.php/dav/trash-bin/admin' })
}

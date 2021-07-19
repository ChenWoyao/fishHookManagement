import React, { useState, useEffect, useRef } from 'react';
import { Upload, message, Modal } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { getToken } from '@/utils/auth';
import request from 'umi-request';
import Api, { baseUrl } from '@/utils/request'


const Uploader = (props) => {
  const [fileList, setFileList] = useState([])
  const [previewImage, setPreviewImage] = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const href = useRef('')
  // props.productId， props.name
  // {/* FormItem会出传给子组件一个value属性和onChange属性 */}
  // {/* 调用onChange(value), 会使得value发生改变 */}
  useEffect(() => {
    // 外部设置value属性发生变化时，filelist更新
    if (props.value) {
      const fileList = getFileListFromProps(props.value)
      setFileList(fileList)
    }
  }, [props])



  const getFileListFromProps = (value) => {
    if (!value) return []
    const fileList = []
    fileList.push({
      uid: -1,
      name: 'file',
      status: 'done',
      url: value,
      thumbUrl: value,
      response: { file: 'file' },
    })
    return fileList
  }

  // fileList变动时更新FormItem的value属性
  const getChangeFile = fileList => {
    const { onChange } = props
    let imageUrl = ""
    for (const file of fileList) {
      if (file.status === 'done') {
        imageUrl = href.current
      }
    }
    onChange && onChange(imageUrl)
  }

  // 删除文件，更新fileLis和value
  const handleRemove = (file) => {
    setFileList([])
    getChangeFile([])
  }

  // 预览
  const handlePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl)
    setPreviewVisible(true)
  }

  const handleChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log('uploading');
    }
    setFileList(info.fileList)
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      getChangeFile(info.fileList)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  // 自定义上传
  const handleUploadRequest = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    setFileList([{
      uid: -1,
      name: `${props.name}`,
      status: 'uploading',
      url: '',
      thumbUrl: '',
      percent: 99,
    }])
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = event => {
      Api(`${baseUrl}/api/products/upload/`, {
        method: 'POST',
        data: {
          "file_name": file.name,
          "id": props.productId,
        },
      })
        .then((response) => {
          if (response.url && response.status === 'success') {
            const url = response.url.split('?')[0]
            href.current = url
            request(response.url, {
              method: 'PUT',
              headers: {
                'Content-Type': 'image/jpeg',
                'Authorization': `JWT ${getToken()}`
              },
              credentials: 'include',
              data: event.target.result,
            })
              .then(res => {
                setFileList([{
                  uid: -1,
                  name: `${file.name.split('.')[0]}`,
                  status: 'done',
                  url: url,
                  thumbUrl: url,
                  response: { file: 'file' },
                }])
                getChangeFile([{
                  uid: -1,
                  name: `${file.name.split('.')[0]}`,
                  status: 'done',
                  url: url,
                  thumbUrl: url,
                }])
              })
              .catch((error) => {
                message.error('图片上传失败，请重试')
              })
          }
        })
    }
  }

  return (
    <>
      <Upload
        customRequest={handleUploadRequest}
        fileList={fileList}
        maxCount={1}
        accept="image/*"
        listType={props.type === 'icon' ? "picture-card" : "text"}
        onChange={handleChange}
        onRemove={handleRemove}
        onPreview={handlePreview}
      >
        {
          props.type === 'icon' ?
            (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )
            :
            (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>点击上传</div>
              </div>
            )
        }
      </Upload>
      <Modal visible={previewVisible} footer={null} onCancel={() => { setPreviewVisible(false) }}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}

export default Uploader

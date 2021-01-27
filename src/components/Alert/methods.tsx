import React, { useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import StaticAlert, {
  StaticAlertProps as AlertProps,
  KINDS
} from './StaticAlert'

type KindType = keyof typeof KINDS

export interface StaticAlertProps extends Omit<AlertProps, 'kind'> {
  text?: string
}

interface InnerItem extends AlertProps {
  key: number
  text?: string
}

const Alert = () => {
  const [list, setList] = useState<InnerItem[]>([])

  const fillApis = (kind: KindType) => {
    return (item: StaticAlertProps | string) => {
      let data: InnerItem = {
        text: '',
        key: count++,
        visible: true,
        duration: 3000,
        kind
      }

      if (typeof item === 'string') {
        data.text = item
        data.closable = false
      } else {
        data = {
          ...data,
          ...item
        }
      }

      if (data.action || data.closable) {
        data.duration = 5000
      }

      setList((list) => {
        list.unshift(data)

        if (list.length > limit) {
          list.forEach((it, i) => {
            if (i > limit - 1) {
              it.visible = false
            }
          })
        }

        return [...list]
      })
    }
  }

  Object.keys(KINDS).map((type: any) => (apis[type] = fillApis(type)))

  const destroy = (key: number) => {
    setList((list) => {
      list.forEach((it) => {
        if (it.key === key) {
          it.visible = false
        }
      })
      return [...list]
    })
  }

  const length = useMemo(() => {
    return list.filter(item => item.visible).length
  }, [list])

  return (
    <div className="alert-fixed-container">
      {
        list.map(({ key, text, ...props }, index) =>
          <>
            {
              props.visible && <StaticAlert key={key} onClose={() => destroy(key!)} {...props}>{text}</StaticAlert>
            }
          </>
        )
      }

    </div>
  )
}


let count = 0
let limit = 2

const apis: any = {
  success: (item: StaticAlertProps | string) => { },
  error: (item: StaticAlertProps | string) => { },
  info: (item: StaticAlertProps | string) => { },
  warning: (item: StaticAlertProps | string) => { }
}

export default apis

function getPortalRoot(document: Document) {
  let root = document.querySelector('#viking-alert-container')
  if (!root) {
    root = document.createElement('div')
    root.id = 'viking-alert-container'
    document.body.appendChild(root)
  }
  return root
}

ReactDOM.render(<Alert />, getPortalRoot(document))




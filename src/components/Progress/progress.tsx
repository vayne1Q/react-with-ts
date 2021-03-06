import React, {
  useCallback,
  useEffect,
  useState,
  forwardRef,
  HTMLAttributes
} from 'react'
import { ThemeProps } from '../Icon/Icon'

interface colorProps {
  color: string
  percentage: number
  [key: string]: any
}
export interface ProgressProps extends HTMLAttributes<HTMLElement> {
  /** 百分比（必填）*/
  percentage: number
  /** 进度条的高度 */
  strokeHeight?: number
  /** 进度条显示文字内置在进度条内 */
  showText?: boolean
  style?: React.CSSProperties
  /** 主题 */
  theme?: ThemeProps
  /** 自定义颜色（支持字符串、数组、函数） */
  customColors?: string | Array<colorProps> | Function
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (props, ref) => {
    const {
      percentage,
      strokeHeight,
      showText,
      style,
      theme,
      customColors,
      ...restProps
    } = props

    const [barColor, setBarColor] = useState<string>('')

    const [barPercentage, setBarPercentage] = useState<number>(
      percentage ? percentage : 0
    )

    const renderDiffColorProgress = useCallback(() => {
      if (typeof customColors === 'string') {
        setBarColor(customColors)
      } else if (Array.isArray(customColors)) {
        let renderColor = ''
        for (let v of customColors) {
          if (v.percentage <= barPercentage) {
            renderColor = v.color
          }
        }
        setBarColor(renderColor)
      } else if (typeof customColors === 'function') {
        setBarColor(customColors(barPercentage))
      }
    }, [percentage, barPercentage, customColors])

    useEffect(() => {
      renderDiffColorProgress()
    }, [renderDiffColorProgress, percentage, customColors])

    useEffect(() => {
      percentage <= 100
        ? percentage < 0
          ? setBarPercentage(0)
          : setBarPercentage(percentage)
        : setBarPercentage(100)
    }, [percentage, barPercentage])

    return (
      <div
        className="viking-progress-bar"
        style={style}
        ref={ref}
        {...restProps}
      >
        <div
          className="viking-progress-bar-outer"
          style={{ height: `${strokeHeight}px` }}
        >
          <div
            className={`viking-progress-bar-inner color-${theme}`}
            style={{ width: `${barPercentage}%`, backgroundColor: barColor }}
          >
            {showText && (
              <span className="inner-text">{`${barPercentage}%`}</span>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Progress.defaultProps = {
  strokeHeight: 15,
  showText: true,
  theme: 'primary'
}

export default Progress

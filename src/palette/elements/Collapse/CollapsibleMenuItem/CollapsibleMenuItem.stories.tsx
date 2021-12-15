import { storiesOf } from "@storybook/react-native"
import { Text } from "palette"
import { CollapsibleMenuItem } from "palette/elements/Collapse/CollapsibleMenuItem/CollapsibleMenuItem"
import React, { useState } from "react"
import { View } from "react-native"
import { withTheme } from "storybook/decorators"

export const Content1: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>Content 1</Text>
    </View>
  )
}

export const Content2: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>Content 2</Text>
    </View>
  )
}
export const Content3: React.FC = ({}) => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>Content 3</Text>
    </View>
  )
}

export const DisplayContent = () => {
  return (
    <View style={{ backgroundColor: `rgba(255,145,125,.3)`, padding: 20, marginTop: 20 }}>
      <Text>This is the collapsible menu content</Text>
    </View>
  )
}

export const ComponentWithCollapsibleMenu = () => {
  const totalSteps = 3
  const [activeStep, setActiveStep] = useState(1)
  const [enabledSteps, setEnabledSteps] = useState([1])
  const items = [
    { stepNumber: 1, title: "Artwork Details", Content: Content1 },
    { stepNumber: 2, title: "2nd component", Content: Content2 },
    { stepNumber: 3, title: "3nd component", Content: Content3 },
  ]

  return (
    <View style={{ margin: 20 }}>
      {items.map((item) => {
        const { stepNumber, title, Content } = item
        return (
          <CollapsibleMenuItem
            key={title}
            title={title}
            stepNumber={stepNumber}
            enabled={enabledSteps.includes(stepNumber)}
            totalSteps={totalSteps}
            activeStep={activeStep}
            enabledSteps={enabledSteps}
            setActiveStep={setActiveStep}
            setEnabledSteps={setEnabledSteps}
            Content={() => <Content />}
          />
        )
      })}
    </View>
  )
}

storiesOf("Collapsable Menu ", module)
  .addDecorator(withTheme)
  .add("Collapse Collapse Items", () => (
    <>
      <ComponentWithCollapsibleMenu />
    </>
  ))

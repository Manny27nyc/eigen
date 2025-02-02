import { fireEvent, waitFor } from "@testing-library/react-native"
import { FilterParamName } from "lib/Components/ArtworkFilter/ArtworkFilterHelpers"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { mockFetchNotificationPermissions } from "lib/tests/mockFetchNotificationPermissions"
import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import { PushAuthorizationStatus } from "lib/utils/PushNotification"
import React from "react"
import { createMockEnvironment } from "relay-test-utils"
import { CreateSavedSearchContent, CreateSavedSearchContentProps } from "./CreateSavedSearchContent"

jest.unmock("react-relay")

const defaultProps: CreateSavedSearchContentProps = {
  filters: [
    {
      displayText: "Bid",
      paramName: FilterParamName.waysToBuyBid,
      paramValue: true,
    },
  ],
  aggregations: [],
  artistId: "artistID",
  artistName: "artistName",
  userAllowsEmails: true,
  onClosePress: jest.fn(),
  onComplete: jest.fn(),
  onUpdateEmailPreferencesPress: jest.fn(),
}

describe("CreateSavedSearchAlert", () => {
  const mockEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
  const notificationPermissions = mockFetchNotificationPermissions(false)

  beforeEach(() => {
    mockEnvironment.mockClear()
    notificationPermissions.mockClear()
  })

  const TestRenderer = (props: Partial<CreateSavedSearchContentProps>) => {
    return <CreateSavedSearchContent {...defaultProps} {...props} />
  }

  it("renders without throwing an error", () => {
    const { getAllByTestId } = renderWithWrappersTL(<TestRenderer />)
    const pills = getAllByTestId("alert-pill")

    expect(pills[0]).toHaveTextContent("Bid")
  })

  it("should call onClosePress handler when the close button is pressed", () => {
    const onCloseMock = jest.fn()
    const { getByTestId } = renderWithWrappersTL(<TestRenderer onClosePress={onCloseMock} />)

    fireEvent.press(getByTestId("fancy-modal-header-left-button"))

    expect(onCloseMock).toBeCalled()
  })

  it("calls onComplete when the mutation is completed", async () => {
    notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))
    const onCompleteMock = jest.fn()

    const { getByTestId } = renderWithWrappersTL(<TestRenderer onComplete={onCompleteMock} />)

    fireEvent.changeText(getByTestId("alert-input-name"), "something new")
    fireEvent.press(getByTestId("save-alert-button"))

    await waitFor(() => {
      const operation = mockEnvironment.mock.getMostRecentOperation()

      expect(operation.request.node.operation.name).toBe("createSavedSearchAlertMutation")
      mockEnvironmentPayload(mockEnvironment, {
        SearchCriteria: () => ({
          internalID: "internalID",
        }),
      })
    })

    expect(onCompleteMock).toHaveBeenCalledWith({
      id: "internalID",
    })
  })

  describe("When AREnableSavedSearchToggles is enabled", () => {
    beforeEach(() => {
      __globalStoreTestUtils__?.injectFeatureFlags({ AREnableSavedSearchToggles: true })
    })

    it("the push notification is enabled by default when push permissions are enabled", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))

      const { findAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      const toggles = await findAllByA11yState({ selected: true })

      expect(toggles).toHaveLength(2)
    })

    it("the push notification is disabled by default when push permissions are denied", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Denied))

      const { findAllByA11yState } = renderWithWrappersTL(<TestRenderer />)

      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the push notification is disabled by default when push permissions are not determined", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.NotDetermined))

      const { findAllByA11yState } = renderWithWrappersTL(<TestRenderer />)
      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })

    it("the email notification is disabled by default if a user has not allowed email notifications", async () => {
      notificationPermissions.mockImplementation((cb) => cb(null, PushAuthorizationStatus.Authorized))
      const { findAllByA11yState } = renderWithWrappersTL(<TestRenderer userAllowsEmails={false} />)

      const toggles = await findAllByA11yState({ selected: false })

      expect(toggles).toHaveLength(1)
    })
  })
})

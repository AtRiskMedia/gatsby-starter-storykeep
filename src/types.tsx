import { ReactElement, JSX } from 'react'
import { IContentMap, IStoryFragmentId } from '@tractstack/types'

export enum ApiStages {
  Booting,
  Open,
  Locked,
  Error,
  Success,
}

export enum Stages {
  Booting,
  Authenticate,
  Authenticating,
  Authenticated,
  UuidConfirm,
  UuidConfirming,
  UuidConfirmed,
  CollectionsLoad,
  CollectionsLoaded,
  SourceLoad,
  SourceLoaded,
  Initialize,
  Initializing,
  Initialized,
  Activated,
}

export enum EditStages {
  Booting,
  AuthorCheck,
  AuthorChecking,
  AuthorChecked,
  CheckEmbedded,
  Cleanup,
  SetInitialState,
  SettingInitialState,
  InitialStateSet,
  Activated,
}

export enum SaveStages {
  Booting,
  NoChanges,
  UnsavedChanges,
  PrepareSave,
  PrepareNodes,
  SaveFiles,
  SavingFiles,
  SavedFiles,
  FilesUpdateAffectedNodes,
  SaveMarkdown,
  PreSavingMarkdown,
  PreSavedMarkdown,
  SavingMarkdown,
  SavedMarkdown,
  MarkdownUpdateAffectedNodes,
  SavePane,
  PreSavingPane,
  PreSavedPane,
  SavingPane,
  SavedPane,
  PaneUpdateAffectedNodes,
  SaveStoryFragment,
  SavingStoryFragment,
  SavedStoryFragment,
  StoryFragmentUpdateAffectedNodes,
  SaveTractStack,
  SavingTractStack,
  SavedTractStack,
  Error,
  Success,
}

export interface ISlideOver {
  children: JSX.Element
  setToggle: Function
}

export interface IEditPanePayload {
  initialState: any
  initialFormState: any
  initialStatePaneFragments: any
  initialStateImpressions: any
  initialStateHeldBeliefs: any
  initialStateWithheldBeliefs: any
  initialStateLivePreview: any
  initialStateLivePreviewMarkdown: any
}

export interface IEditPaneFlags {
  isAuthor: boolean
  isEmbeddedEdit: boolean
  isAdmin: boolean
  isBuilder: boolean
  isOpenDemo: boolean
  isEmptyPane: boolean
  saveStage: number
  editStage: number
}

export interface ISiteBuilderConfig {
  openDemo: boolean
  messageDelay: number
}

export interface IUseDrupalJSONAPI {
  baseURL: string
  collection?: string
  selector?: string
  include?: string[]
  sortBy?: string
  apiBase?: string
}

export interface IReactChild {
  children: ReactElement
}

export interface IUUID {
  uuid: string
  viewportKey?: string
}

export interface IEditViewport {
  uuid: string
}
export interface IBuilderStoryFragment {
  uuid: string
  state: any // FIX
  editPaneEnabled: string
  setEditPaneEnabled: Function
  tailwindBgColour: string
  handleInsertPane: Function
  handleReorderPane: Function
}

export interface IAdd {
  idx: number
}

export interface IRenderPane {
  uuid: string
  toggleCheck?: boolean
  handlers?: any // FIX
  previewPayload?: any | null // FIX
}

export interface IRenderPaneLive {
  previewPayload: any // FIX
  active: number
  setViewportMode: Function
}

export interface IEditForm {
  uuid: string
  handleToggle: Function
  setThisUuid: Function
  payload: any // FIX
}
export interface IEditFormInner {
  uuid: string
  handleToggle: Function
  handleReplacePane: Function
  setThisUuid: Function
  payload: any // FIX
}

export interface IEditFormPaneFragment {
  state: any // FIX
  handleChange: Function
}
export interface IFormHandler {
  state: any // FIX
  handleChange: Function
}

export interface IPaneFragmentPayload {
  uuid: string
  thisPaneFragment: any // FIX
  viewportKey: string
  files: { [key: string]: any } // FIX
}

export interface ILayout {
  children: ReactElement
  current: string
  openDemo?: boolean
}

export interface ICleanerNode {
  [key: string]: string
}

export interface IDrupalState {
  stage: number
  setStage: Function
  apiStage: number
  setApiStage: Function
  embeddedEdit: {
    child: null | string
    childType: null | string
    parent: null | string
    parentType: null | string
  }
  setEmbeddedEdit: Function
  cleanerQueue: ICleanerNode[]
  setCleanerQueue: Function
  removeCleanerQueue: Function
  setStoryFragment: Function
  setPane: Function
  viewportKey: string
  setViewportKey: Function
  locked: string
  setLocked: Function
  drupalQueue: any // FIX
  drupalPreSaveQueue: any // FIX
  drupalResponse: any // FIX
  drupalLocked: string
  drupalSoftLock: boolean
  selected: string
  selectedCollection: string
  openDemoEnabled: boolean
  oauthDrupalUuid: string
  oauthDrupalRoles: string
  allTractStacks: any // FIX
  allStoryFragments: any // FIX
  allPanes: any // FIX
  allFiles: any // FIX
  allMenus: any // FIX
  allResources: any // FIX
  allMarkdown: any // FIX
  allCollections: any // FIX
  removePane: Function
  removeMarkdown: Function
  removeDrupalQueue: Function
  removeDrupalPreSaveQueue: Function
  removeDrupalResponse: Function
  setDrupalSaveNode: Function
  setDrupalPreSaveQueue: Function
  setDrupalLocked: Function
  setDrupalSoftLock: Function
  setDrupalQueue: Function
  setDrupalResponse: Function
  setSelected: Function
  setSelectedCollection: Function
  setOpenDemoEnabled: Function
  setOauthDrupalUuid: Function
  setOauthDrupalRoles: Function
  updateIngestSource: Function
  updateCollections: Function
  updateTractStacks: Function
  updateStoryFragments: Function
  updatePanes: Function
  updateFiles: Function
  updateMenus: Function
  updateResources: Function
  updateMarkdown: Function
}

export interface IEdit {
  uuid: string
  handleToggle: Function
  handleReplacePane?: Function
}

export interface IEditBelief {
  selector: string
  value: string
  index: number
  mode: string
  handleChangeBelief: Function
}

export interface IMessage {
  children: ReactElement
  className?: string
}

export interface IEditSlideOver {
  children: ReactElement
  title: string
  setSelected: Function
}

export interface IAxiosProfileProps {
  profile: {
    bio: string
    codeword: string
    email: string
    firstname: string
    init: boolean
    persona: string
  }
}

export interface IAuthStorePayload {
  authenticated: boolean
  badLogin: boolean
}

export interface IAuthStoreState {
  accessToken: string | null
  authData: IAuthStorePayload
  validToken: boolean
  fingerprint: string | null
  setFingerprint: Function
  isLoggedIn: Function
  login: Function
  logout: Function
}

export interface IAuthStoreLoginResponse {
  tokens: string
  jwt: string | null
  auth: boolean
}

export interface IAxiosConnectProps {
  fingerprint: string
}

export interface IAxiosStoryFragmentProps {
  storyFragmentId: string
}
export interface IAxiosTriggerPublishProps {
  tailwindArray: string[]
}

// export interface IAxiosGraphProps {
//  target: string
//  id?: string
// }

export interface IContentEditableContainer {
  initialValue: any
  useRefCallback: Function
  className: string
  title: string
  nth: number
  parent?: number
  Tag:
    | `h1`
    | `h2`
    | `h3`
    | `h4`
    | `h5`
    | `h6`
    | `p`
    | `li`
    | `code`
    | `img`
    | `ol`
    | `ul`
}

export interface IIntercept {
  nth: number
  parent?: number
  mode?: string
  tag?: string
  payload?: any
}

export interface IInterceptOverride {
  nth: number
  childNth?: number
  childGlobalNth?: number
  mode?: string
  tag?: string
  payload?: any
}

export interface IEditInPlace {
  nth: number
  Tag:
    | `h1`
    | `h2`
    | `h3`
    | `h4`
    | `h5`
    | `h6`
    | `p`
    | `li`
    | `code`
    | `img`
    | `ol`
    | `ul`
  value: any // FIX
  className: string
  parent?: number
}
export interface IEditInPlaceControls {
  tag: string
  tagType: string
  nth: number
  childNth: number
  childGlobalNth: number
  stateLivePreview: any
  stateLivePreviewMarkdown: any
  handleChangeEditInPlace: any
  viewportKey: string
  reset: Function
  pageStylesPagination: any
  setPageStylesPagination: Function
  hasBgColourId: string | null
  hasBgColour: string | null
  hasBreaks: boolean
}

export interface IAxiosClientProps {
  options: any
  getCurrentAccessToken: Function
  refreshTokenUrl: string | undefined
  setRefreshedTokens: Function
  getAuthData: Function
  logout: Function
}

export interface IBuilderRenderPaneProps {
  viewportKey: string
  payload: {
    panePayload: IContentMap
    children: ReactElement
  }
  paneId: string
  storyFragmentId: IStoryFragmentId
  viewportClasses: string
  editPaneEnabled: string
  setEditPaneEnabled: Function
}

export interface IEditDetailsPane {
  uuid: string
  editPaneEnabled: string
  data: any // FIX
  setEditPaneEnabled: Function
}

export interface IBuilderPaneProps {
  thisId: string
  paneId: string
  children: any
  inView?: any
  observe?: any
  hasMaxHScreen: boolean
  handleToggle: Function
  editPaneEnabled: string
}

export interface IActivityDetails {
  [key: string]: {
    engagement: number
    daysSince: number
    colorOffset: string
    read: number
    glossed: number
    clicked: number
    entered: number
    discovered: number
  }
}

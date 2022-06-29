import * as React from 'react'
import { Dialog, DialogFooter } from '../dialog'
import { TabBar } from '../tab-bar'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { Commit } from '../../models/commit'
import { CommitList } from './commit-list'

export enum UnreachableCommitsTab {
  Unreachable,
  Reachable,
}

interface IUnreachableCommitsDialogProps {
  /** The shas of the currently selected commits */
  readonly selectedShas: ReadonlyArray<string>

  /** The shas of the shas showed in the diff */
  readonly shasInDiff: ReadonlyArray<string>

  /** The commits loaded, keyed by their full SHA. */
  readonly commitLookup: Map<string, Commit>

  /** Used to set the selected tab. */
  readonly selectedTab: UnreachableCommitsTab

  /** The emoji lookup to render images inline */
  readonly emoji: Map<string, string>

  /** Called to dismiss the  */
  readonly onDismissed: () => void
}

interface IUnreachableCommitsDialogState {
  /** The currently select tab. */
  readonly selectedTab: UnreachableCommitsTab
}

/** The component for for viewing the unreachable commits in the current diff a repository. */
export class UnreachableCommitsDialog extends React.Component<
  IUnreachableCommitsDialogProps,
  IUnreachableCommitsDialogState
> {
  public constructor(props: IUnreachableCommitsDialogProps) {
    super(props)

    this.state = {
      selectedTab: props.selectedTab,
    }
  }

  public componentWillUpdate(nextProps: IUnreachableCommitsDialogProps) {
    const currentSelectedTab = this.props.selectedTab
    const selectedTab = nextProps.selectedTab

    if (currentSelectedTab !== selectedTab) {
      this.setState({ selectedTab })
    }
  }

  private onTabClicked = (selectedTab: UnreachableCommitsTab) => {
    this.setState({ selectedTab })
  }

  private renderTabs() {
    return (
      <TabBar
        onTabClicked={this.onTabClicked}
        selectedIndex={this.state.selectedTab}
      >
        <span>Unreachable</span>
        <span>Reachable</span>
      </TabBar>
    )
  }

  private getShasToDisplay = () => {
    const { selectedTab } = this.state
    const { shasInDiff, selectedShas } = this.props
    if (selectedTab === UnreachableCommitsTab.Reachable) {
      return shasInDiff
    }

    return selectedShas.filter(sha => !shasInDiff.includes(sha))
  }

  private renderActiveTab() {
    const { commitLookup, emoji } = this.props
    return (
      <div className="unreachable-commit-list">
        <CommitList
          gitHubRepository={null}
          isLocalRepository={true}
          commitLookup={commitLookup}
          commitSHAs={this.getShasToDisplay()}
          selectedSHAs={[]}
          localCommitSHAs={[]}
          emoji={emoji}
        />
      </div>
    )
  }

  private renderFooter() {
    return (
      <DialogFooter>
        <OkCancelButtonGroup />
      </DialogFooter>
    )
  }

  public render() {
    return (
      <Dialog
        className="unreachable-commits"
        title={__DARWIN__ ? 'Unreachable Commits' : 'Unreachable commits'}
        onSubmit={this.props.onDismissed}
        onDismissed={this.props.onDismissed}
      >
        {this.renderTabs()}
        {this.renderActiveTab()}
        {this.renderFooter()}
      </Dialog>
    )
  }
}

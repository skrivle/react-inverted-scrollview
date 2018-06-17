// @flow

import React, { Component, type Node } from 'react';

export type Props = {
    onScroll: (info: { scrollBottom: number, scrollTop: number }) => any,
    width: number,
    height: number,
    style: {},
    children: Node
};

export default class ScrollView extends Component<Props> {
    _currentScrollBottom: number;
    _scrollContainer: ?HTMLElement;

    static defaultProps = {
        onScroll: () => {},
        width: 100,
        height: 100,
        style: {}
    };

    _currentScrollBottom = 0;

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (!this._scrollContainer) return;
        this.setScrollBottom(this._currentScrollBottom);
    }

    scrollToTop() {
        if (!this._scrollContainer) return;
        this._scrollContainer.scrollTop = 0;
    }

    scrollToBottom() {
        this.setScrollBottom(0);
    }

    setScrollBottom(value: number) {
        const container = this._scrollContainer;
        if (!container) return;
        const height = this._getScrollContainerHeight();
        container.scrollTop = container.scrollHeight - height - value;
    }

    _handleScroll = () => {
        const { onScroll } = this.props;
        const container = this._scrollContainer;

        if (!container) return;

        const height = this._getScrollContainerHeight();
        const scrollTop = container.scrollTop;
        this._currentScrollBottom = container.scrollHeight - (height + scrollTop);

        onScroll({ scrollBottom: this._currentScrollBottom, scrollTop });
    };

    _getScrollContainerHeight() {
        const container = this._scrollContainer;
        return container ? container.getBoundingClientRect().height : 0;
    }

    render() {
        const { height, width, style } = this.props;

        return (
            <div
                onScroll={this._handleScroll}
                style={{
                    overscrollBehavior: 'contain contain',
                    height: height,
                    width: width,
                    overflowY: 'scroll',
                    ...style
                }}
                ref={ref => (this._scrollContainer = ref)}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100%',
                        justifyContent: 'flex-end'
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

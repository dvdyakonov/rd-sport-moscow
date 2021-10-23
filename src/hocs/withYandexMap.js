import React from 'react';
import { attachYandexMap, attachYandexHeatmap } from 'utils';

function withYandexMap(WrappedComponent) {
    return class extends React.Component {
        state = {
            isYmapsInit: false
        }
        componentDidMount() {
            var self = this;
            !this.state.isYmapsInit && attachYandexMap(function () {
                self.setState({'isYmapsInit': true})
                attachYandexHeatmap();
            });
        }

        render() {
            return <WrappedComponent isYmapsInit={this.state.isYmapsInit} {...this.props} />;
        }
    };
}

export default withYandexMap;

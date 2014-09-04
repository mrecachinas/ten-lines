
/** @jsx React.DOM */

var React = require('react/addons');
var Fluxxor = require('fluxxor');
var FluxChildMixin = Fluxxor.FluxChildMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin('FilterStore', 'FlatStore');
var cx = React.addons.classSet;

// A component to unify things that get red strikethrus when hovered
var XHover = React.createClass({
    render: function() {
        return this.transferPropsTo(
            <span className="x-hover tooltip-right">
                {this.props.children}
            </span>
        );
    }
});

var FilterFiles = React.createClass({
    mixins: [FluxChildMixin, StoreWatchMixin],

    getStateFromFlux: function() {
        var flux = this.getFlux();
        var largest = flux.store('FlatStore').getState().largest

        return mixin(flux.store('FilterStore').getState(), {
            largest: largest
        });
    },

    filterName:  function(e) {
        var username = e.target.value.length ? e.target.value : false;
        this.getFlux().actions.filter.userFilter(username);
    },

    renderUserSearch: function() {
        var username = this.state.username;

        return (
            <div>
                <h2>Username</h2>
                <input
                    type="text"
                    placeholder="username"
                    value={username || ''}
                    onChange={this.filterName} />
            </div>
        );
    },

    filterSize: function(e) {
        var size = e.target.value;
        this.getFlux().actions.filter.sizeFilter(size);
    },

    renderFileSize: function() {
        console.log(this.state.largest);
        return (
            <div>
                <h2>File Size</h2>
                <input
                    type="range"
                    min="1"
                    step="10"
                    value={this.state.fileSize}
                    max={this.state.largest}
                    onChange={this.filterSize} />

                {this.state.fileSize}
            </div>
        );
    },

    renderFileExtensions: function() {
        var self = this;
        var filtered = this.state.filtered || [];
        var actions = self.getFlux().actions.filter;

        var extensions = compose(
            uniq,
            map(function(obj) { return obj.filename.split('.').pop(); })
        )(filtered);

        extensions = map(function(ext) {
            var filter = actions.addExtension.bind(null, ext);

            return (
                <li>
                    <XHover onClick={filter}>
                        *.{ext}
                    </XHover>
                </li>
            );
        }, extensions);

        return (
            <div>
                <h2>Extensions</h2>
                <ul> {extensions} </ul>
            </div>
        );
    },

    renderFiles: function() {
        var self = this;
        var filtered = this.state.filtered || [];
        var actions = self.getFlux().actions.filter;

        var files = map(function(obj) {
            var filter = actions.addFilter.bind(null, obj.filename);
            var name = obj.filename.split('/');
            if (name.length > 1) {
                name = last(name);
            }

            return (
                <li>
                    <XHover onClick={filter} data-tooltip={obj.filename}>
                        {name}: {obj.contents.length}
                    </XHover>
                </li>
            );
        }, filtered);

        return (
            <div>
                <h2>Files</h2>
                <ul> {files} </ul>
            </div>
        );
    },

    render: function() {
        var self = this;
        var actions = self.getFlux().actions.filter;

        return (
            <div>
                <h1>Filters</h1>
                {self.state.active
                    ? <strong onClick={actions.resetFilters}>reset</strong>
                    : <span onClick={actions.resetFilters}>reset</span>}

                {this.renderUserSearch()}
                {this.renderFileSize()}
                {this.renderFileExtensions()}
                {this.renderFiles()}
            </div>
        );
    }
});

module.exports = FilterFiles;

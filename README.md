# Angular Material Time Select

[![npm version](https://img.shields.io/npm/v/ngx-material-time-select.svg)](https://www.npmjs.org/package/ngx-material-time-select)
[![build status](https://img.shields.io/travis/yannickebongue/ngx-material-time-select.svg)](https://travis-ci.org/yannickebongue/ngx-material-time-select)
[![license](https://img.shields.io/github/license/yannickebongue/ngx-material-time-select.svg)](https://opensource.org/licenses/MIT)

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## About

The time select allows users to enter a time either through text input, or by choosing a time from
the select panel. It is made up of several components and directives that work together.

<!-- example(time-select-overview) -->

## Installation

1. Checkout the Angular Material [Getting Started Guide](https://material.angular.io/guide/getting-started)
if not installed.

2. Install Angular Material Time Select. Also install Moment.js library if not done yet.

```bash
npm install --save moment ngx-material-time-select
```

3. Import the time select module:

```ts
...
import {MatTimeSelectModule} from 'ngx-material-time-select';

@NgModule({
  ...
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTimeSelectModule
  ]
  ...
})
export class MyModule { }
```

4. Include a prebuilt theme in your `style.css`:

```css
@import "~ngx-material-time-select/prebuilt-themes/indigo-pink.css";
```

## Usage

### Connecting a time select to an input

A time-select is composed of a text input and a select panel pop-up, connected via the `matTimeSelect`
property on the text input.

```html
<input [matTimeSelect]="myTimeSelect">
<mat-time-select #myTimeSelect></mat-time-select>
```

An optional time select toggle button is available. A toggle can be added to the example above:

```html
<input [matTimeSelect]="myTimeSelect">
<mat-time-select-toggle [for]="myTimeSelect"></mat-time-select-toggle>
<mat-time-select #myTimeSelect></mat-time-select>
```

This works exactly the same with an input that is part of an `<mat-form-field>` and the toggle
can easily be used as a prefix or suffix on the material input:

```html
<mat-form-field>
  <input matInput [matTimeSelect]="myTimeSelect">
  <mat-time-select-toggle matSuffix [for]="myTimeSelect"></mat-time-select-toggle>
  <mat-time-select #myTimeSelect></mat-time-select>
</mat-form-field>
```

If you want to customize the icon that is rendered inside the `mat-time-select-toggle`, you can do so
by using the `matTimeSelectToggleIcon` directive:

<!-- example(time-select-custom-icon) -->

### Setting the selected time

The type of values that the time select expects depends on the type of `TimeAdapter` provided in your
application. When using the default `TimeAdapter`, the values will all be Moment.js instances.

Depending on the `TimeAdapter` being used, the time select may automatically deserialize certain time
formats for you as well. For example, the `TimeAdapter` allow
[ISO 8601](https://tools.ietf.org/html/rfc3339) strings to be passed to the time select and
automatically converted to the proper object type. This can be convenient when binding data directly
from your backend to the time select. However, the time select will not accept time strings formatted
in user format such as `"1:25 PM"` as this is ambiguous and will mean different things depending on
the locale of the browser running the code.

As with other types of `<input>`, the time select works with `@angular/forms` directives such as
`formGroup`, `formControl`, `ngModel`, etc.

<!-- example(time-select-value) -->

### Changing the time select colors

The time select popup will automatically inherit the color palette (`primary`, `accent`, or `warn`)
from the `mat-form-field` it is attached to. If you would like to specify a different palette for
the popup you can do so by setting the `color` property on `mat-time-select`.

<!-- example(time-select-color) -->

### Time validation

There are two properties that add time validation to the time select input. The `min` and `max`
properties.

<!-- example(time-select-min-max) -->

Each validation property has a different error that can be checked:
 * A value that violates the `min` property will have a `matTimeSelectMin` error.
 * A value that violates the `max` property will have a `matTimeSelectMax` error.

### Input and change events

The input's native `(input)` and `(change)` events will only trigger due to user interaction with
the input element; they will not fire when the user selects a time from the select panel.
Therefore, the time select input also has support for `(timeInput)` and `(timeChange)` events. These
trigger when the user interacts with either the input or the popup.

The `(timeInput)` event will fire whenever the value changes due to the user typing or selecting a
time from the select panel. The `(timeChange)` event will fire whenever the user finishes typing input
(on `<input>` blur), or when the user chooses a time from the select panel.

<!-- example(time-select-events) -->

### Disabling parts of the time select

As with any standard `<input>`, it is possible to disable the time select input by adding the
`disabled` property. By default, the `<mat-time-select>` and `<mat-time-select-toggle>` will inherit
their disabled state from the `<input>`, but this can be overridden by setting the `disabled`
property on the time select or toggle elements. This can be useful if you want to disable text input
but allow selection via the select panel or vice-versa.

<!-- example(time-select-disabled) -->

### Manually opening and closing the select panel

The select panel can be programmatically controlled using the `open` and `close` methods on the
`<mat-time-select>`. It also has an `opened` property that reflects the status of the popup.

<!-- example(time-select-api) -->

### Internationalization

Internationalization of the time select is configured via three aspects:
 1. The time locale.
 2. The display and parse formats used by the time select.
 4. The message strings used in the time select's UI.

#### Setting the locale code

By default, the `MAT_TIME_LOCALE` injection token will use the existing `LOCALE_ID` locale code
from `@angular/core`. If you want to override it, you can provide a new value for the
`MAT_TIME_LOCALE` token:

```ts
@NgModule({
  providers: [
    {provide: MAT_TIME_LOCALE, useValue: 'en-GB'},
  ],
})
export class MyApp {}
```

It's also possible to set the locale at runtime using the `setLocale` method of the `TimeAdapter`.

<!-- example(time-select-locale) -->

#### Customizing the parse and display formats

The `MAT_TIME_FORMATS` object is just a collection of formats that the time select uses when parsing
and displaying times. These formats are passed through to the `TimeAdapter` so you will want to make
sure that the format objects you're using are compatible with the `TimeAdapter` used in your app.

```ts
@NgModule({
  imports: [MatTimeSelectModule],
  providers: [
    {provide: MAT_TIME_FORMATS, useValue: MY_TIME_FORMATS},
  ],
})
export class MyApp {}
```

<!-- example(time-select-formats) -->

#### Localizing labels and messages

The various text strings used by the time select are provided through `MatTimeSelectIntl`.
Localization of these messages can be done by providing a subclass with translated values in your
application root module.

```ts
@NgModule({
  imports: [MatTimeSelectModule],
  providers: [
    {provide: MatTimeSelectIntl, useClass: MyIntl},
  ],
})
export class MyApp {}
```

### Accessibility

The `MatTimeSelectInput` and `MatTimeSelectToggle` directives add the `aria-haspopup` attribute to
the native input and toggle button elements respectively, and they trigger a select panel dialog with
`role="dialog"`.

`MatTimeSelectIntl` includes strings that are used for `aria-label`s. The time select input
should have a placeholder or be given a meaningful label via `aria-label`, `aria-labelledby` or
`MatTimeSelectIntl`.

#### Keyboard shortcuts

The time select supports the following keyboard shortcuts:

| Shortcut             | Action                                    |
|----------------------|-------------------------------------------|
| `ALT` + `DOWN_ARROW` | Open the select panel pop-up              |
| `ESCAPE`             | Close the select panel pop-up             |

### Troubleshooting

#### Error: A MatTimeSelectComponent can only be associated with a single input

This error is thrown if more than one `<input>` tries to claim ownership over the same
`<mat-time-select>` (via the `matTimeSelect` attribute on the input). A time select can only be
associated with a single input.

#### Error: Attempted to open a MatTimeSelectComponent with no associated input.

This error occurs if your `<mat-time-select>` is not associated with any `<input>`. To associate an
input with your time select, create a template reference for the time select and assign it to the
`matTimeSelect` attribute on the input:

```html
<input [matTimeSelect]="picker">
<mat-time-select #picker></mat-time-select>
```

## License

Copyright (c) 2019 Yannick Ebongue

Released under the MIT License (see [LICENSE](LICENSE))

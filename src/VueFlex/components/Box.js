import Number_isNumber from '/utils/Number/isNumber';

export default {
	name: 'VueFlexBox',

	props: {
		tag: {
			type: String,
			default: 'div',
		},

		directionColumn: {
			type: Boolean,
			default: false,
		},

		reverseDirection: {
			type: Boolean,
			default: false,
		},

		wrap: {
			type: Boolean,
			default: false,
		},

		reverseWrap: {
			type: Boolean,
			default: false,
		},

		justifyContent: {
			type: String,
			default: 'flex-start',
		},

		alignItems: {
			type: String,
			default: 'stretch',
		},

		alignContent: {
			type: String,
			default: 'stretch',
		},

		spacing: {
			type: [Number, String],
			default: 0,
		},
	},

	computed: {
		normalizedSpacing() {
			let {spacing} = this;

			return Number_isNumber(spacing) ? `${spacing}px` : spacing;
		},

		nested() {
			return this.$parent && this.$parent.$options.name === this.$options.name;
		},

		childMarginExpression() {
			if (this.nested) {
				return this.$parent.childMarginExpression;
			}
			return `${this.normalizedSpacing} / 2`;
		},

		childMargin() {
			return `calc(${this.childMarginExpression})`;
		},

		innerMarginExpression() {
			return `-1 * (${this.childMarginExpression})`;
		},

		innerMargin() {
			return `calc(${this.innerMarginExpression})`;
		},

		innerSizeExpression() {
			return `100% - (${this.innerMarginExpression}) * 2`;
		},

		innerSize() {
			return `calc(${this.innerSizeExpression})`;
		},

		outerMargin() {
			if (this.nested) {
				return this.$parent.childMargin;
			}
		},
	},

	render(createElement) {
		let {
			$slots,
			alignContent,
			alignItems,
			directionColumn,
			innerMargin,
			innerSize,
			justifyContent,
			nested,
			outerMargin,
			reverseDirection,
			reverseWrap,
			tag,
			wrap,
		} = this;

		let innerElement = createElement(
			'div',
			{
				style: {
					margin: innerMargin,
					width: innerSize,
					height: innerSize,
					display: nested ? 'flex' : 'inline-flex',
					flexDirection: (
						directionColumn
							? reverseDirection
								? 'column-reverse'
								: 'column'
							: reverseDirection
								? 'row-reverse'
								: 'row'
					),
					flexWrap: (
						wrap
							? reverseWrap
								? 'wrap-reverse'
								: 'wrap'
							: 'nowrap'
					),
					justifyContent: justifyContent,
					alignItems: alignItems,
					alignContent: alignContent,
				},
			},
			$slots.default,
		);
		let outerElement = createElement(
			tag,
			{
				style: {
					margin: outerMargin,
				},
			},
			[innerElement],
		);
		return outerElement;
	},
};

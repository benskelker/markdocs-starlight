BASE_DIR="../src/content/source-html"
OUT_DIR="../src/content/gen-mdoc-files"

convert_html_to_markdoc() {
    local input_file="$1"
    local relpath="${input_file#"$BASE_DIR"/}"
    local outdir="$OUT_DIR/$(dirname "$relpath")"
    mkdir -p "$outdir"

    local fname="$(basename "$relpath")"
    local output_file="$outdir/${fname%.*}.mdoc"

    echo "Converting: $input_file → $output_file"
    pandoc \
      --from=html+raw_html+native_divs+native_spans \
      --to=markdown+raw_html+raw_attribute \
      --standalone \
      "$input_file" -o "$output_file"

    echo "  ✓ $output_file"
}

export BASE_DIR OUT_DIR

find "$BASE_DIR" -type f \( -name "*.htm" -o -name "*.xhtml"  -o -name "*.flsnp" \) | while read -r file; do
    convert_html_to_markdoc "$file"
done
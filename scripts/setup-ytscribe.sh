#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ytscribe_dir="${project_dir}/.ytscribe"
venv_dir="${project_dir}/.venv-ytscribe"
ytscribe_ref="bd04947a93ce32ed173ec16561f8810f38af30fc"

python_bin=""

for candidate in \
  python3.12 /opt/homebrew/bin/python3.12 /usr/local/bin/python3.12 \
  python3.11 /opt/homebrew/bin/python3.11 /usr/local/bin/python3.11 \
  python3.10 /opt/homebrew/bin/python3.10 /usr/local/bin/python3.10 \
  python3; do
  if command -v "${candidate}" >/dev/null 2>&1; then
    python_bin="${candidate}"
    break
  fi
done

if [[ -z "${python_bin}" ]] || ! "${python_bin}" -c 'import sys; raise SystemExit(sys.version_info < (3, 10))'; then
  echo "Serve Python 3.10 o superiore per installare una versione aggiornata di yt-dlp." >&2
  exit 1
fi

if [[ ! -f "${ytscribe_dir}/scripts/ytscribe.py" ]]; then
  if [[ -e "${ytscribe_dir}" ]]; then
    echo "La directory ${ytscribe_dir} esiste ma non contiene scripts/ytscribe.py." >&2
    exit 1
  fi

  git clone --no-checkout https://github.com/alexwbend/ytscribe.git "${ytscribe_dir}"
  git -C "${ytscribe_dir}" checkout "${ytscribe_ref}"
fi

if [[ -x "${venv_dir}/bin/python" ]] && ! "${venv_dir}/bin/python" -c 'import sys; raise SystemExit(sys.version_info < (3, 10))'; then
  rm -rf "${venv_dir}"
fi

if [[ ! -x "${venv_dir}/bin/python" ]]; then
  "${python_bin}" -m venv "${venv_dir}"
fi

"${venv_dir}/bin/python" -m pip install --disable-pip-version-check --upgrade pip yt-dlp

echo "ytscribe pronto: ${venv_dir}/bin/python"

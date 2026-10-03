#!/bin/bash
# Append the function to the real user .bashrc if it isn't already there
#!/bin/bash
# Append the function to the real user .bashrc if it isn't already there
if ! grep -Fq "autocommit() {" ~/.bashrc; then
  cat << 'EOF' >> ~/.bashrc
 
autocommit() {
    bash commit.sh "$1"
}
portForward(){
    python3 -m http.server 8080
}
EOF
fi

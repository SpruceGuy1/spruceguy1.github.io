#!/bin/bash
# Append the function to the real user .bashrc if it isn't already there
#!/bin/bash
# Append the function to the real user .bashrc if it isn't already there
if ! grep -q "my_function" ~/.bashrc; then
  cat << 'EOF' >> ~/.bashrc
 
autocommit() {
    bash commit.sh $1
}
EOF
fi

package com.example.homedasher_prod

import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import com.google.accompanist.systemuicontroller.rememberSystemUiController

@Composable
fun MerchantRegistrationScreen(navController: NavHostController? = null, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val systemUiController = rememberSystemUiController()
    val backgroundColor = Color(0xFFE0F7FA)

    SideEffect {
        systemUiController.setSystemBarsColor(color = backgroundColor)
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(backgroundColor)
            .padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Merchant Registration",
            fontWeight = FontWeight.SemiBold,
            fontSize = 30.sp,
            color = Color(0xFF37474F)
        )

        Spacer(modifier = Modifier.height(16.dp))

        var email by remember { mutableStateOf("") }
        var storeName by remember { mutableStateOf("") }
        var address by remember { mutableStateOf("") }
        var phoneNumber by remember { mutableStateOf("") }
        var storeType by remember { mutableStateOf("African") }
        var password by remember { mutableStateOf("") }
        var confirmPassword by remember { mutableStateOf("") }

        val storeTypes = listOf("African", "Mexican", "Asian", "Italian")
        var expanded by remember { mutableStateOf(false) }

        Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(
                value = email,
                onValueChange = { email = it },
                label = { Text("Email") },
                leadingIcon = { Icon(Icons.Outlined.Email, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                singleLine = true
            )

            OutlinedTextField(
                value = storeName,
                onValueChange = { storeName = it },
                label = { Text("Store Name") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = address,
                onValueChange = { address = it },
                label = { Text("Address") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = phoneNumber,
                onValueChange = { phoneNumber = it },
                label = { Text("Phone Number") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Box(modifier = Modifier.fillMaxWidth().clickable { expanded = true }) {
                OutlinedTextField(
                    value = storeType,
                    onValueChange = { },
                    label = { Text("Store Type") },
                    modifier = Modifier.fillMaxWidth(),
                    readOnly = true
                )
                DropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    storeTypes.forEach { type ->
                        DropdownMenuItem(
                            onClick = {
                                storeType = type
                                expanded = false
                            },
                            text = { Text(text = type) }
                        )
                    }
                }
            }

            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                leadingIcon = { Icon(Icons.Outlined.Lock, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true
            )

            OutlinedTextField(
                value = confirmPassword,
                onValueChange = { confirmPassword = it },
                label = { Text("Confirm Password") },
                leadingIcon = { Icon(Icons.Outlined.Lock, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                singleLine = true
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (password == confirmPassword) {
                    registerMerchant(email, storeName, address, phoneNumber, storeType, password, confirmPassword, context)
                } else {
                    Toast.makeText(context, "Passwords do not match", Toast.LENGTH_SHORT).show()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5))
        ) {
            Text(
                text = "Register",
                fontSize = 17.sp,
                modifier = Modifier.padding(vertical = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Text(
                text = "Already have an account? ",
                fontSize = 16.sp,
                color = Color(0xFF37474F)
            )
            Text(
                text = "Login",
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.clickable {
                    navController?.navigate("login")
                }
            )
        }
    }
}


@Preview(showBackground = true)
@Composable
fun PreviewMerchantRegistrationScreen() {
    MerchantRegistrationScreen()
}